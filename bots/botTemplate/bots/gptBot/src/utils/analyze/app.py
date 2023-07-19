import os
import uuid
import logging
import requests
from flask import Flask, request, jsonify
from langchain.document_loaders import CSVLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.agents import create_csv_agent
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)

class DocumentProcessor:
    def __init__(self, temp_folder_path):
        self.temp_folder_path = temp_folder_path
        os.makedirs(self.temp_folder_path, exist_ok=True)

    def _download_file(self, file_url):
        # Download the file from the URL
        unique_file_name = f"{uuid.uuid4()}.csv"
        file_path = f"{self.temp_folder_path}/{unique_file_name}"

        try:
            response = requests.get(file_url)
            response.raise_for_status()  # Raises a HTTPError if the response status is 4xx, 5xx
        except (requests.RequestException, requests.HTTPError) as err:
            logging.error(f"Error occurred while downloading the file: {err}")
            raise

        with open(file_path, 'wb') as f:
            f.write(response.content)

        return file_path

    def _create_index(self, file_path):
        # Load the documents
        loader = CSVLoader(file_path=file_path)

        # Create an index using the loaded documents
        index_creator = VectorstoreIndexCreator()
        docsearch = index_creator.from_loaders([loader])

        return docsearch

    def process_query(self, file_url, question):
        file_path = self._download_file(file_url)

        # docsearch = self._create_index(file_path)

        # Create a question-answering chain using the index
        # chain = RetrievalQA.from_chain_type(llm=OpenAI(), chain_type="stuff", retriever=docsearch.vectorstore.as_retriever(),
        #                                     input_key="question")

        # Pass a query to the chain
        # response = chain({"question": question})

        agent = create_csv_agent(OpenAI(temperature=0), file_path, verbose=True)
        response = agent.run(question)
        print('RESULT = ', response)

        # Delete the file after processing
        os.remove(file_path)

        # return response['result']
        return str(response)

app = Flask(__name__)
doc_processor = DocumentProcessor(temp_folder_path="./temp")

os.environ["OPENAI_API_KEY"] = os.getenv('OPENAI_API_KEY')


@app.route('/query', methods=['POST'])
def query():
    file_url = request.json.get('file_url')
    question = request.json.get('question')

    if not file_url or not question:
        return jsonify({'error': 'Missing file_url or question in request'}), 400

    try:
        response = doc_processor.process_query(file_url, question)
    except Exception as e:
        logging.error(f"Error occurred while processing the query: {e}")
        return jsonify({'error': str(e)}), 500

    return jsonify(response)

if __name__ == '__main__':
    app.run(port=5000)