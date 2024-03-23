const userManager = require('./api/functional/userManager');
const databaseManager = require('./api/functional/databaseManager');

//First we test functions locally.
var testUser = {
    userId: -1,
    username: null,
    password: null,
}



//#region User

test("Creates Usre1.", async ()=>{
    testUser.password = 'ACB123';
    testUser.username = 'Usre1';
    const result = await userManager.createUser(testUser.username, testUser.password);
    
    testUser.userId = result.insertId;
    expect(result).toBeDefined();
})

test("Changes Usre1 password from ACB123 to ABC123", async () =>{
    const result = await userManager.changePassword(testUser.userId, 'ABC123', testUser.password);
    testUser.password = 'ABC123';
    expect(result.changedRows).toBe(1);
})

test("Usre1's old password is no longer valid", async ()=>{
    const result = await userManager.validPassword(testUser.userId, 'ACB123');
    expect(result).toBe(false);
})

test("Renames 'Usre1' to 'User1'.", async ()=>{
    testUser.username = 'User1';
    const result = await userManager.changeUsername(testUser.userId, testUser.username, testUser.password);
    expect(result.changedRows).toBe(1);
})

test("Promote 'User1' to admin.", async ()=>{
    const result = await databaseManager.updateAdmin(testUser.userId, true);
    expect(result.changedRows).toBe(1);
})

test("Check if 'User1' is admin.", async ()=>{
    const result = await databaseManager.userIsAdmin(testUser.userId);
    expect(result).toBe(1);
})

test("Demote 'User1' to regular.", async ()=>{
    const result = await databaseManager.updateAdmin(testUser.userId, false);
    expect(result.changedRows).toBe(1);
})

test("Check if 'User1' is regular.", async ()=>{
    const result = await databaseManager.userIsAdmin(testUser.userId);
    expect(result).toBe(0);
})

test("Login User1", async ()=>{
    const result = await userManager.loginUser(testUser.username, testUser.password);
    expect(Object.prototype.toString.call(result)).not.toEqual("[object Error]");
})

//#endregion

const rootTaskValues={
    taskId:-1,

    userId: testUser.userId,
    name: 'ROOT',
    description:'Cool',
    parentTask: null,
    
    priority: 5,
    state:'In Progress',
    deadline: new Date().toISOString().slice(0, 19).replace('T', ' ')
}

//#region Task

test('Create ROOT task by User1 \'Cool\' description, priority 5, In Progress, and today as deadline', async ()=>{
    const result = await databaseManager.insertTask(testUser.userId, rootTaskValues);
    expect(result.insertId).toBe(rootTaskValues.taskId); 
})

test('Select ROOT task by Id and compare task fields',async ()=>{
    const result = await databaseManager.selectTaskById(rootTaskValues.taskId);
    expect(result[0].taskId).toBe(rootTaskValues.taskId);
    expect(result[0].name).toBe(rootTaskValues.name);
    expect(result[0].description).toBe(rootTaskValues.description);
    expect(result[0].parentTask).toBe(rootTaskValues.parentTask);
})

test('Select ROOT task by User Id and compare task fields',async ()=>{
    const result = await databaseManager.selectAssignedTasks(testUser.userId);
    expect(result[0].taskId).toBe(rootTaskValues.taskId);
    expect(result[0].name).toBe(rootTaskValues.name);
    expect(result[0].description).toBe(rootTaskValues.description);
    expect(result[0].parentTask).toBe(rootTaskValues.parentTask);
})

test('Select ROOT\'s status by Id and compare fields',async ()=>{
    const result = await databaseManager.selectStatusById(rootTaskValues.taskId); 
    expect(result[0].taskId).toBe(rootTaskValues.taskId);
    expect(result[0].priority).toBe(rootTaskValues.priority);
    expect(result[0].state).toBe(rootTaskValues.state);
    //FIXME: WRONG FORMAT?
    //expect(result[0].deadline).toBe(rootTaskValues.deadline);
})

test('Select ROOT\'s assigned user', async()=>{
    const result = await databaseManager.selectAssignedUser(rootTaskValues.taskId);
    expect(result[0].userId).toBe(testUser.userId);
})

test('Delete task', async()=>{
    const result = await databaseManager.deleteTaskById(rootTaskValues.taskId);
    expect(result[0].affectedRows).toBe(1);
    expect(result[1].affectedRows).toBe(1);
    expect(result[2].affectedRows).toBe(1);
})  
//#endregion

const tree ={
        name:'ROOT',
        parentTask:null,
        children:[
            {
                name:'1A',
                children:[
                    {
                        name:'2A',
                        children:[
                            {
                                name:'3A',
                                children:[
                                    {
                                        name:'4A',
                                        children:[
                                            {
                                                name:'5A'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name:'2B'
                    },
                    {
                        name:'2C',
                        children:[
                            {
                                name:'3B',
                                children:[
                                    {
                                        name: '4B',
                                        children:[
                                            {
                                                name:'5B'
                                            },
                                            {
                                                name:'5C'
                                            }
                                        ]
                                    }
                                ]
                                
                            },
                            {
                                name:'3C'
                            }
                        ]

                    },
                    {
                        name:'2D'
                    }
                ]
            },
            {
                name:'1B',
                children:[
                    {
                        name:'2E',
                        children:[
                            {
                                name:'3D'
                            },
                            {
                                name:'3E'
                            },
                            {
                                name:'3F'
                            }
                        ]
                    }
                ]
            },
            {
                name:'1C',
                children:[
                    {
                        name:'2F',
                        children:[
                            {
                                name:"3H",
                                children:[
                                    {
                                        name:'4C',
                                        children:[
                                            {
                                                name:'5D'
                                            },{
                                                name:'5E'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                ]
            },
            {
                name:'1D',
                children:[
                    {
                        name:'2G',
                        children:[
                            {
                                name:'3I'
                            },{
                                name:'3J',
                                children:[
                                    {
                                        name:'4D',
                                        children:[
                                            {
                                                name:'5F'
                                            },{
                                                name:'5G'
                                            },
                                        ]
                                    }
                                ]
                            },
                        ]
                    },{
                        name:'2H'
                    }
                ]
            }
        ]
}

async function insertTree(node, parentId, first=true){
    const result = await databaseManager.insertTask(testUser.userId, {name: node.name, parentTask:parentId});
    if(first){
        tree.taskId = result.insertId;
    }
    if("children" in node){
        for(child of node.children){
            await insertTree(child, result.insertId, false);
        }
    }
}

test('Populate insert test tree', async ()=>{
    const res = await insertTree(tree, null);
})

const interestTasks = {
    A3: null,
    H3: null,
    D4: null,
    G2: null
}

test('Test task update functions', async()=>{
    var result = await databaseManager.selectSubtasks(tree.taskId);
    result = result.flat();
    for(res of result){
        //For later!
        if(res.name == '3A'){
            interestTasks.A3 = res.taskId;
        }
        if(res.name == '4D'){
            interestTasks.D4 = res.taskId;
        }
        if(res.name == '2G'){
            interestTasks.G2 = res.taskId;
        }

        if(res.name=='3H'){
            await databaseManager.updateTaskName(res.taskId, '3G')
            await databaseManager.updateTaskDescription(res.taskId, 'Updated Description')

        }
        if(res.name=='3I'){
            await databaseManager.updateTaskName(res.taskId, '3H')
            interestTasks.H3 = res.taskId
            await databaseManager.updateTaskPriority(res.taskId, 3)
        }
        if(res.name=='3J'){
            await databaseManager.updateTaskName(res.taskId, '3I')
            await databaseManager.updateTaskState(res.taskId, 'Done')

        }
    }
    for(res of result){
        if(res.name == '4C'){
            await databaseManager.updateTaskParent(res.taskId, interestTasks.H3)
        }
    }
})

var newUserId = null;

test('Assign user to tasks', async()=>{
    newUserId = await userManager.createUser('User2', 'ABC1234');
    const result1 = await databaseManager.assignUser(newUserId.insertId, interestTasks.A3);
    const result2 = await databaseManager.assignUser(newUserId.insertId, interestTasks.D4);
    expect(result1.affectedRows).toBe(1);
    expect(result2.affectedRows).toBe(1);
})

test("Wiping subtree", async()=>{
    const result = await databaseManager.wipeTree(interestTasks.G2);
    const check = await databaseManager.selectTaskById(interestTasks.G2);
    console.log(check);
    expect(check).toEqual([]);
})

test('Delete assigned user by admin', async()=>{
    const result = await userManager.deleteUser(testUser.userId, newUserId.insertId, 'ABC123')
    console.log(result);
    expect(result.affectedRows).toBe(1);
})

test('Self delete user', async()=>{
    const result = await userManager.deleteUser(testUser.userId, testUser.userId, 'ABC123')
    console.log(result);
    expect(result.affectedRows).toBe(1);
})


