import torch
from peft import PeftModel, PeftConfig
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline



model = AutoModelForCausalLM.from_pretrained(
            base_model, device_map='auto', low_cpu_mem_usage=True
        )

model = PeftModel.from_pretrained(
            model,
            peft_model_id,
            device_map='auto',
        )
