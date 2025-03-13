import tkinter as tk
from tkinter import scrolledtext
from ibm_watsonx_ai.foundation_models.utils.enums import ModelTypes
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
from ibm_watsonx_ai.foundation_models.utils.enums import DecodingMethods
from langchain_ibm import WatsonxLLM
from langchain.chains import RetrievalQA

# Define model type and parameters
model_id = ModelTypes.GRANITE_13B_CHAT_V2
parameters = {
    GenParams.DECODING_METHOD: DecodingMethods.GREEDY,
    GenParams.MIN_NEW_TOKENS: 1,
    GenParams.MAX_NEW_TOKENS: 100,
    GenParams.STOP_SEQUENCES: ["<|endoftext|>"]
}

# Credentials (replace with actual credentials)
credentials = {
    "url": "https://api.au-syd.assistant.watson.cloud.ibm.com/instances/5ce979e2-0132-460d-b5ab-2b577d585077",
    "apikey": "Ee-gh6HyY18G9I8ZxCMCP-pQdN7jN446WHB6BG9yNVZa",
    "instance_id": "openshift"
}
project_id = "44e53991-fb57-4054-860c-acb0d4091602"

# Initialize the Granite model
watsonx_granite = WatsonxLLM(
    model_id=model_id.value,
    url=credentials.get("url"),
    apikey=credentials.get("apikey"),
    project_id=project_id,
    params=parameters
)

# Initialize RetrievalQA (ensure `docsearch` is defined elsewhere in the project)
qa = RetrievalQA.from_chain_type(llm=watsonx_granite, chain_type="stuff", retriever=docsearch.as_retriever())

# GUI Application
def send_message():
    user_input = user_entry.get()
    if user_input.strip():
        chat_window.insert(tk.END, f"You: {user_input}\n", "user")
        response = qa.invoke(user_input)
        chat_window.insert(tk.END, f"Bot: {response}\n", "bot")
        chat_window.yview(tk.END)
        user_entry.delete(0, tk.END)

# Initialize GUI
root = tk.Tk()
root.title("Granite AI Chatbot")
root.geometry("500x600")

# Chat display window
chat_window = scrolledtext.ScrolledText(root, wrap=tk.WORD, state=tk.NORMAL, height=25, width=60)
chat_window.tag_configure("user", foreground="blue")
chat_window.tag_configure("bot", foreground="green")
chat_window.pack(pady=10)

# User input field
user_entry = tk.Entry(root, width=50)
user_entry.pack(pady=5)

# Send button
send_button = tk.Button(root, text="Send", command=send_message)
send_button.pack()

# Run the GUI event loop
root.mainloop()
