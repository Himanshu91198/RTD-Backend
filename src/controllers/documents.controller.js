import { Document } from "../models/documents.model.js";
import { User } from "../models/users.model.js";

export const getDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    const documents = await Document.find({
      $or: [{ ownerId: userId }, { collaborators: userId }],
    })
      .populate("collaborators", "email username")
      .populate("ownerId", "email username")
      .select("_id title updatedAt ownerId collaborators")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (err) {
    console.error("Get documents error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
};

export const createDocument = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const ownerId = req.user.id;

    const allUsers = await User.find({}, "_id");

    const collaboratorIds = allUsers.map((user) => user._id);

    const newDocument = await Document.create({
      title,
      ownerId,
      content: "start typing...",
      collaborators: collaboratorIds,
    });

    return res.status(201).json({
      success: true,
      message: "Document created with all users as collaborators",
      document: newDocument,
    });
  } catch (err) {
    console.error("Create document error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create document",
    });
  }
};

export const saveDocument = async (req, res) => {
  try {
    const { documentId, content } = req.body;

    if (!documentId || !content)
      return res
        .status(400)
        .json({ message: "Document Id and content are required" });

    const doc = await Document.findById(documentId);

    if (!doc) {
      return res.status(404).json({
        message: "Document not found",
      });
    }
    doc.content = content;
    await doc.save();

    return res.status(200).json({
      success: true,
      message: "Document updated successfully",
      data: doc,
    });
  } catch (err) {
    console.error("Update document error", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update document" });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { documentId, title } = req.body;

    if (!documentId || !title)
      return res
        .status(400)
        .json({ message: "Document id and title are required" });

    const doc = await Document.findById(documentId);
    if (!doc) return res.status(400).json({ message: "Document not found" });

    doc.title = title;
    doc.save();

    res.status(200).json({
      success: true,
      message: "Document updated successfully",
      data: doc,
    });
  } catch (err) {
    console.error("Update document error", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update document" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.body;

    if (!documentId)
      return res.status(400).json({ message: "Document Id is invalid" });

    const doc = await Document.deleteOne({ _id: documentId });

    if (doc.deletedCount === 0)
      return res.status(400).json({ message: "Document not found" });

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (err) {
    console.error("Delete document error", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete document" });
  }
};
