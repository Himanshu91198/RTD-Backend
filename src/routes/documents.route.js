import { Router } from "express";
import {
  createDocument,
  getDocuments,
  saveDocument,
  updateDocument,
  deleteDocument,
} from "../controllers/documents.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/create_document", authMiddleware, createDocument);
router.get("/get_documents", authMiddleware, getDocuments);
router.patch("/save_document", authMiddleware, saveDocument);
router.post("/update_document", authMiddleware, updateDocument);
router.post("/delete_document", authMiddleware, deleteDocument);
export default router;
