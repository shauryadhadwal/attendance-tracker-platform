const { buildSchema } = require('graphql');

const schema = buildSchema(`
        type Admin {
            _id: ID!
            email: String!
            password: String
            firstName: String!
            lastName: String
        }
        
        input AdminInput {
            email: String!
            password: String!
            firstName: String!
            lastName: String
        }

        type Batch {
            _id: ID!
            name: String!
            members: [Student!]!
        }

        type Student {
            _id: ID!
            firstName: String!
            lastName: String
            email: String!
            phone: String!
            batches: [Batch!]!
        }

        input StudentInput {
            firstName: String!
            lastName: String
            email: String!
            phone: String!
        }

        type Attendance {
            _id: ID!
            student: Student!
            batch: Batch!
            year: Int!
            month: Int!
            day: Int!
            present: Boolean!
            comment: String
        }

        input AttendanceInput {
            studentId: ID!
            batchId: ID!
            year: Int!
            month: Int!
            day: Int!
            present: Boolean!
            comment: String
        }

        type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: String!
        }
        
        type RootQuery {
            admins: [Admin!]!
            students: [Student!]!
            batches: [Batch!]!
            attendances(studentId: ID!, batchId: ID!): [Attendance!]!
            login(email: String! password: String!): AuthData!
        }

        type RootMutation {
            createAdmin(adminInput: AdminInput!): Admin!
            createStudent(studentInput: StudentInput!): Student!
            createAttendance(attendanceInput: AttendanceInput!): Attendance!
            createBatch(name: String!): Batch!
            addStudentToBatch(studentId: ID!, batchId: ID!): Batch!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `);

module.exports = schema;