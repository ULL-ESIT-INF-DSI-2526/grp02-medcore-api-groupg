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
        Patient: {
          type: "object",
          properties: {
            _id: { type: "string" },
            fullName: { type: "string" },
            birthDate: { type: "string", format: "date-time" },
            idNumber: { type: "string" },
            socialSecurityNumber: { type: "string" },
            gender: { type: "string", enum: ["male", "female", "other"] },
            contact: {
              type: "object",
              properties: {
                address: { type: "string" },
                phone: { type: "string" },
                email: { type: "string" },
              },
            },
            allergies: { type: "array", items: { type: "string" } },
            bloodType: {
              type: "string",
              enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"],
            },
            status: { type: "string", enum: ["active", "inactive", "deceased"] },
          },
        },
        PatientCreate: {
          type: "object",
          required: [
            "fullName",
            "birthDate",
            "idNumber",
            "socialSecurityNumber",
            "gender",
            "contact",
            "bloodType",
          ],
          properties: {
            fullName: { type: "string", example: "Juan Pérez" },
            birthDate: { type: "string", format: "date-time" },
            idNumber: { type: "string", example: "12345678A" },
            socialSecurityNumber: { type: "string", example: "SS123456" },
            gender: { type: "string", enum: ["male", "female", "other"] },
            contact: {
              type: "object",
              properties: {
                address: { type: "string" },
                phone: { type: "string" },
                email: { type: "string" },
              },
            },
            allergies: { type: "array", items: { type: "string" } },
            bloodType: {
              type: "string",
              enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"],
            },
            status: { type: "string", enum: ["active", "inactive", "deceased"] },
          },
        },
        Staff: {
          type: "object",
          properties: {
            _id: { type: "string" },
            fullName: { type: "string" },
            collegiateNumber: { type: "string" },
            specialty: { type: "string" },
            category: { type: "string" },
            shift: { type: "string" },
            assignedConsultation: { type: "string" },
            yearsOfExperience: { type: "number" },
            departmentContact: { type: "string" },
            status: { type: "string" },
          },
        },
        StaffCreate: {
          type: "object",
          required: [
            "fullName",
            "collegiateNumber",
            "specialty",
            "category",
            "shift",
            "assignedConsultation",
            "departmentContact",
          ],
          properties: {
            fullName: { type: "string" },
            collegiateNumber: { type: "string" },
            specialty: { type: "string" },
            category: { type: "string" },
            shift: { type: "string" },
            assignedConsultation: { type: "string" },
            yearsOfExperience: { type: "number" },
            departmentContact: { type: "string" },
            status: { type: "string" },
          },
        },

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