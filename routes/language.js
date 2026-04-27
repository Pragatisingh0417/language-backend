const router = require("express").Router();
const Language = require("../models/Language");
const auth = require("../middleware/auth");

// GET all languages (for app)
router.get("/", async (req, res) => {
  const langs = await Language.find();
  res.json(langs);
});

// ADD language (admin)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Not allowed" });

  const lang = await Language.create(req.body);
  res.json(lang);
});

router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Not allowed" });

  await Language.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});


module.exports = router;