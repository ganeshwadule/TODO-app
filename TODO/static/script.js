// Function for adding TODO's
function addTodo() {
    const newTodo = prompt('Enter a new todo:');
    if (newTodo !== null && newTodo.trim() !== '') {
        // Send the new todo to the server
        fetch('/add_todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ todo: newTodo }),
        })
            .then(response => response.json())
            .then(data => {
                // Create a new todo div
                const newItem = document.createElement('div');
                newItem.className = 'item';
                newItem.innerHTML = `
                    <span>${data.todo}</span>
                    <div class="btn">
                        <button onclick="updateTodo('${data._id}')"><img src="static\e.png" alt="U" width="20px"></button>
                        <button onclick="deleteTodo('${data._id}')"><img src="static\delete.png" alt="R" width="25px"></button>
                    </div>
                `;

                // Insert the new todo div before the fixed icon
                const container = document.querySelector('.container');
                container.insertBefore(newItem, document.getElementById('add'));
                location.reload();
                // Position the icon at the bottom right corner
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

async function updateTodo(todoId) {
    const newTodo = prompt('Enter new todo:');

    if (newTodo !== null) {
        try {
            const response = await fetch('/update_todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id=${encodeURIComponent(todoId)}&new_todo=${encodeURIComponent(newTodo)}`,
            });

            if (response.ok) {
                // Update the todo text on the client side
                const todoElement = document.getElementById(`todo-${todoId}`);
                todoElement.textContent = newTodo;
                location.reload();
            } else {
                console.error('Failed to update todo');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// Function for removing a TODO

function deleteTodo(todoId) {
    const userConfirmed = confirm('Are you sure you want to delete this todo?');

    if (userConfirmed) {
        // User clicked OK, perform the delete action
        deleteTodoOnServer(todoId);
    } else {
        // User clicked Cancel, do nothing or provide feedback
        console.log('User canceled deletion');
    }
}

async function deleteTodoOnServer(todoId) {
    try {
        const response = await fetch('/delete_todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${encodeURIComponent(todoId)}`,
        });

        if (response.ok) {
            // Assuming successful deletion, you can update the UI as needed
            const todoElement = document.getElementById(`todo-${todoId}`);
            todoElement.remove(); // Remove the todo element from the DOM

        } else {
            console.error('Failed to delete todo');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
