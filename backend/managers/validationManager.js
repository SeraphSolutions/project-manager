const { throwError } = require('../managers/errorManager');

function validateNullFields(fields){
    (fields instanceof Array) ? {} : throwError(500);    
    fields.forEach((field) => {
        if(!field){
            throwError(400);
        }
    });
}

function validateFieldTypes(fields, fieldTypes){
    (fields instanceof Array) ? {} : throwError(500);
    (fieldTypes instanceof Array) ? {} : throwError(500);  

    fields.forEach((field, index) => {
        if(fieldTypes[index] == Number){
            (isNaN(Number(field)) || !Number.isInteger(Number(field))) ? throwError(400) : {};
        }
        else if(fieldTypes[index] == String){
            (typeof(field) == 'string') ? {} : throwError(400);
        }
        else if(fieldTypes[index] == Date){
            (new Date(field) instanceof Date && !isNaN(myDate)) ? {} : throwError(400)
        }
        else if(fieldTypes[index] == Array){
            (field instanceof Array) ? {} : throwError(400);
        } else {
            throwError(400);
        }
    });
}

function validateFieldValueType(field, value){
    switch(field){
        case('id'):
        validateFieldType([value], [Number]);
        break;

        case('creator'):
        validateFieldType([value], [Number]);
        break;
        
        case('title'):
        validateFieldType([value], [String]);
        break;
        
        case('description'):
        validateFieldType([value], [String]);
        break;

        case('deadline'):
        validateFieldType([value], [Date]);
        break;

        case('username'):
        validateFieldType([value], [String]);
        break;

        case('hashedPassword'):
        validateFieldType([value], [String]);
        break;

        case('isAdmin'):
        validateFieldType([value], [Boolean]);
        break;

        case('assignedTask'):
        validateFieldType([value], [Array]);
        break;
    }
}

module.exports = {
    validateNullFields, validateFieldTypes, validateFieldValueType,
}