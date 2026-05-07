import swaggerJSDoc, { Options } from "swagger-jsdoc";


const options: Options = {
 definition: {
   openapi: "3.0.0",
   info: {
     title: "MedCore REST API",
     version: "1.0.0",
     description: "API para gestión de pacientes, personal, medicamentos y registros médicos",
   },
   servers: [
     {
       url: process.env.SWAGGER_SERVER,
     },
   ],
   components: {
     schemas: {
       Medication: {
         type: "object",
         properties: {
           _id: { type: "string" },
           name: { type: "string" },
           activeIngredient: { type: "string" },
           nationalCode: { type: "string" },
           form: { type: "string" },
           dose: { type: "number" },
           unit: { type: "string" },
           route: { type: "string" },
           stock: { type: "number" },
           price: { type: "number" },
           requiresPrescription: { type: "boolean" },
           expirationDate: { type: "string", format: "date-time" },
           contraindications: { type: "array", items: { type: "string" } },
         },
       },
       MedicationCreate: {
         type: "object",
         required: [
           "name",
           "activeIngredient",
           "nationalCode",
           "form",
           "dose",
           "unit",
           "route",
           "stock",
           "price",
           "requiresPrescription",
           "expirationDate",
         ],
         properties: {
           name: { type: "string" },
           activeIngredient: { type: "string" },
           nationalCode: { type: "string" },
           form: { type: "string" },
           dose: { type: "number" },
           unit: { type: "string" },
           route: { type: "string" },
           stock: { type: "number" },
           price: { type: "number" },
           requiresPrescription: { type: "boolean" },
           expirationDate: { type: "string", format: "date-time" },
           contraindications: { type: "array", items: { type: "string" } },
         },
       },
       PrescribedMedication: {
         type: "object",
         properties: {
           medication: { type: "string" },
           quantity: { type: "number" },
           posology: { type: "string" },
         },
       },
       Record: {
         type: "object",
         properties: {
           _id: { type: "string" },
           patient: { type: "string" },
           doctor: { type: "string" },
           type: { type: "string", enum: ["consulta", "ingreso"] },
           startDate: { type: "string", format: "date-time" },
           endDate: { type: "string", format: "date-time" },
           reason: { type: "string" },
           diagnosis: { type: "string" },
           medications: {
             type: "array",
             items: { $ref: "#/components/schemas/PrescribedMedication" },
           },
           totalAmount: { type: "number" },
           status: { type: "string", enum: ["abierto", "cerrado"] },
         },
       },
       RecordCreate: {
         type: "object",
         required: ["patientIdNumber", "doctorCollegiateNumber", "type", "reason", "diagnosis"],
         properties: {
           patientIdNumber: { type: "string", example: "12345678A" },
           doctorCollegiateNumber: { type: "string", example: "COL1234" },
           type: { type: "string", enum: ["consulta", "ingreso"] },
           reason: { type: "string" },
           diagnosis: { type: "string" },
           medications: {
             type: "array",
             items: {
               type: "object",
               properties: {
                 nationalCode: { type: "string" },
                 quantity: { type: "number" },
                 posology: { type: "string" },
               },
             },
           },
         },
       },
       ErrorResponse: {
         type: "object",
         properties: {
           error: { type: "string" },
         },
       },
     },
   },
 },
 apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};


export const swaggerSpec = swaggerJSDoc(options);