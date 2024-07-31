use('project_manager');
usrnm = "pepe"
psswd = "salchichon"
db.User.insertOne(
    {
        "username" : usrnm,
        "password" : psswd

    }
);