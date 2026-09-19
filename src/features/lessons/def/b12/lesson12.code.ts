export const OPERATORS = `from airflow.sdk import task
from airflow.providers.standard.operators.bash import BashOperator
from airflow.providers.standard.sensors.filesystem import FileSensor

run_this = BashOperator(
    task_id="run_after_loop", bash_command="echo 1"
)

@task
def airflow():
    print("airflow")

wait_for_file = FileSensor(
    task_id="wait_for_file",
    filepath="/tmp/temporary_file_for_testing",
    fs_conn_id="fs_default", mode="reschedule",
    poke_interval=60, timeout=3600,
)

from docker.types import Mount
from airflow.providers.docker.operators.docker import DockerOperator

train_task = DockerOperator(
    task_id="train_task",
    image="fullstackdatascience/airflow-lgb-stage:0.0.1",
    container_name="airflow-lgb-stage",
    api_version="auto", auto_remove="success",
    network_mode="bridge",
    docker_url="unix://var/run/docker.sock",
    docker_conn_id="training_registry",
    mounts=[
        Mount(source="/srv/training/dags/lightgbm",
              target="/training/code", type="bind"),
        Mount(source="/srv/training/data",
              target="/training/data", type="bind"),
    ],
    mount_tmp_dir=False,
    working_dir="/training", command="python code/train.py",
)`;
export const XCOM = `from airflow.sdk import get_current_context

def train_model():
    ti = get_current_context()["ti"]
    ti.xcom_push(key="model_path", value="s3://models/v2/model.pkl")

def evaluate_model():
    ti = get_current_context()["ti"]
    model_uri = ti.xcom_pull(task_ids="train_model", key="model_path")
    return model_uri`;
export const GATE = `from datetime import datetime, timezone
from airflow.sdk import dag, task

@dag(schedule=None, start_date=datetime(2026, 5, 15, tzinfo=timezone.utc),
     catchup=False, max_active_runs=1)
def orders_gate():
    @task
    def extract():
        return [{"order_id": 101, "amount": 120000},
                {"order_id": None, "amount": 80000}]

    @task(retries=0)
    def validate(rows):
        ids = [row["order_id"] for row in rows]
        if None in ids or len(set(ids)) != len(ids):
            raise ValueError("order_id must be non-null and unique")
        if any(row["amount"] <= 0 for row in rows):
            raise ValueError("amount must be positive")
        return rows

    @task(trigger_rule="all_success")
    def publish(rows):
        return {"count": len(rows),
                "total": sum(row["amount"] for row in rows)}

    publish(validate(extract()))

orders_gate()`;
export const CONTRACT = JSON.stringify({
  name: 'retail_transactions', version: 1,
  producer: 'retail', consumer: 'analytics',
  fields: { transaction_id: { type: 'INTEGER', nullable: false }, user_id: { type: 'INTEGER', nullable: false }, purchase_date: { type: 'DATE', nullable: false }, age: { type: 'INTEGER', min: 0, max: 120 } },
  unique: ['transaction_id'], freshness_hours: 24,
  on_failure: 'quarantine_and_alert_both_owners',
}, null, 2);
