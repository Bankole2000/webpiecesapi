const { Router } = require("express");

const router = Router();

const updateRequestController = require("../controllers/updateRequestController");

router.get("/", updateRequestController.getAllUpdateRequests);
router.post("/", updateRequestController.addUpdateRequest);

module.exports = router;
