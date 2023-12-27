from flask import Flask,render_template,request,jsonify
import pymongo
from bson import ObjectId

app = Flask(__name__)
#Server for creating database
server=pymongo.MongoClient("mongodb://localhost:27017")
#database creation with name todos
db=server['todos']
#collection in database having name mytodos
coll=db['mytodos']

@app.route('/',methods=['POST','GET'])
def index():
    data=coll.find()
    return render_template('index.html',data=data)

@app.route("/add_todo", methods=['POST'])
def add_todo():
    if request.method == 'POST':
        todo = request.json.get('todo', '')
        if todo:
            data = {'todo': todo}
            inserted_data = coll.insert_one(data)
            inserted_id = str(inserted_data.inserted_id)
            response_data = {'_id': inserted_id, 'todo': todo}
            return jsonify(response_data)
        return jsonify({'error': 'Invalid todo'}), 400

@app.route('/update_todo', methods=['POST'])
def update_todo():
    if request.method == 'POST':
        todo_id = request.form.get('id')
        new_todo = request.form.get('new_todo')

        # Update the todo in the MongoDB collection
        coll.update_one({'_id': ObjectId(todo_id)}, {'$set': {'todo': new_todo}})

        # Respond with a success message
        return jsonify({'status': 'success'})

@app.route('/delete_todo', methods=['POST'])
def delete_todo():
    if request.method == 'POST':
        id = request.form.get('id')

        coll.delete_one({'_id':ObjectId(id)})

    return jsonify({'status': 'success'})
app.run(debug=True)
