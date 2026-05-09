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
            _id: { type: "string", example: "6650f1c2a9b1c3e5f4a12345" },
            fullName: { type: "string", example: "Juan Pérez" },
            birthDate: { type: "string", format: "date-time", example: "1990-05-10T00:00:00.000Z" },
            idNumber: { type: "string", example: "12345678A" },
            socialSecurityNumber: { type: "string", example: "SS123456" },
            gender: { type: "string", enum: ["male", "female", "other"], example: "male" },
            contact: {
              type: "object",
              properties: {
                address: { type: "string", example: "Calle Mayor 12" },
                phone: { type: "string", example: "600123456" },
                email: { type: "string", example: "juan@example.com" },
              },
            },
            allergies: { type: "array", items: { type: "string" }, example: ["penicilina"] },
            bloodType: {
              type: "string",
              enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"],
              example: "A+",
            },
            status: { type: "string", enum: ["active", "inactive", "deceased"], example: "active" },
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
            birthDate: { type: "string", format: "date-time", example: "1990-05-10T00:00:00.000Z" },
            idNumber: { type: "string", example: "12345678A" },
            socialSecurityNumber: { type: "string", example: "SS123456" },
            gender: { type: "string", enum: ["male", "female", "other"], example: "male" },
            contact: {
              type: "object",
              properties: {
                address: { type: "string", example: "Calle Mayor 12" },
                phone: { type: "string", example: "600123456" },
                email: { type: "string", example: "juan@example.com" },
              },
            },
            allergies: { type: "array", items: { type: "string" }, example: ["penicilina"] },
            bloodType: {
              type: "string",
              enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"],
              example: "A+",
            },
            status: { type: "string", enum: ["active", "inactive", "deceased"], example: "active" },
          },
        },

        Staff: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6650f1c2a9b1c3e5f4a99999" },
            fullName: { type: "string", example: "Dr. Laura Gómez" },
            collegiateNumber: { type: "string", example: "COL12345" },
            specialty: { type: "string", example: "Cardiología" },
            category: { type: "string", example: "Doctor" },
            shift: { type: "string", example: "mañana" },
            assignedConsultation: { type: "string", example: "Consulta 12" },
            yearsOfExperience: { type: "number", example: 8 },
            departmentContact: { type: "string", example: "922123456" },
            status: { type: "string", example: "active" },
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
            fullName: { type: "string", example: "Dr. Laura Gómez" },
            collegiateNumber: { type: "string", example: "COL12345" },
            specialty: { type: "string", example: "Cardiología" },
            category: { type: "string", example: "Doctor" },
            shift: { type: "string", example: "mañana" },
            assignedConsultation: { type: "string", example: "Consulta 12" },
            yearsOfExperience: { type: "number", example: 8 },
            departmentContact: { type: "string", example: "922123456" },
            status: { type: "string", example: "active" },
          },
        },

        Medication: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6650f1c2a9b1c3e5f4a77777" },
            name: { type: "string", example: "Ibuprofeno" },
            activeIngredient: { type: "string", example: "Ibuprofen" },
            nationalCode: { type: "string", example: "123456789" },
            form: { type: "string", example: "comprimido" },
            dose: { type: "number", example: 600 },
            unit: { type: "string", example: "mg" },
            route: { type: "string", example: "oral" },
            stock: { type: "number", example: 50 },
            price: { type: "number", example: 4.99 },
            requiresPrescription: { type: "boolean", example: false },
            expirationDate: { type: "string", format: "date-time", example: "2026-12-31T00:00:00.000Z" },
            contraindications: { type: "array", items: { type: "string" }, example: ["hipertensión"] },
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
            name: { type: "string", example: "Ibuprofeno" },
            activeIngredient: { type: "string", example: "Ibuprofen" },
            nationalCode: { type: "string", example: "123456789" },
            form: { type: "string", example: "comprimido" },
            dose: { type: "number", example: 600 },
            unit: { type: "string", example: "mg" },
            route: { type: "string", example: "oral" },
            stock: { type: "number", example: 50 },
            price: { type: "number", example: 4.99 },
            requiresPrescription: { type: "boolean", example: false },
            expirationDate: { type: "string", format: "date-time", example: "2026-12-31T00:00:00.000Z" },
            contraindications: { type: "array", items: { type: "string" }, example: ["hipertensión"] },
          },
        },

        PrescribedMedication: {
          type: "object",
          properties: {
            medication: { type: "string", example: "6650f1c2a9b1c3e5f4a77777" },
            quantity: { type: "number", example: 2 },
            posology: { type: "string", example: "1 comprimido cada 8h" },
          },
        },

        Record: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6650f1c2a9b1c3e5f4a55555" },
            patient: { type: "string", example: "6650f1c2a9b1c3e5f4a12345" },
            doctor: { type: "string", example: "6650f1c2a9b1c3e5f4a99999" },
            type: { type: "string", enum: ["consulta", "ingreso"], example: "consulta" },
            startDate: { type: "string", format: "date-time", example: "2026-01-10T10:00:00.000Z" },
            endDate: { type: "string", format: "date-time", example: "2026-01-10T10:30:00.000Z" },
            reason: { type: "string", example: "Dolor de cabeza" },
            diagnosis: { type: "string", example: "Migraña" },
            medications: {
              type: "array",
              items: { $ref: "#/components/schemas/PrescribedMedication" },
            },
            totalAmount: { type: "number", example: 9.98 },
            status: { type: "string", enum: ["abierto", "cerrado"], example: "abierto" },
          },
        },

        RecordCreate: {
          type: "object",
          required: ["patientIdNumber", "doctorCollegiateNumber", "type", "reason", "diagnosis"],
          properties: {
            patientIdNumber: { type: "string", example: "12345678A" },
            doctorCollegiateNumber: { type: "string", example: "COL1234" },
            type: { type: "string", enum: ["consulta", "ingreso"], example: "consulta" },
            reason: { type: "string", example: "Dolor de cabeza" },
            diagnosis: { type: "string", example: "Migraña" },
            medications: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  nationalCode: { type: "string", example: "123456789" },
                  quantity: { type: "number", example: 2 },
                  posology: { type: "string", example: "1 comprimido cada 8h" },
                },
              },
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string", example: "Resource not found" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
