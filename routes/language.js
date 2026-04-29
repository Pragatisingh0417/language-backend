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
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Not allowed" });

    const { name, code, locale, flag } = req.body;

    // ✅ Normalize (avoid case issues)
    const normalizedName = name.toLowerCase();
    const normalizedCode = code.toLowerCase();

    // ✅ Check duplicate (name OR code)
    const existing = await Language.findOne({
      $or: [
        { name: normalizedName },
        { code: normalizedCode }
      ]
    });

    if (existing) {
      return res.status(400).json({ msg: "Language already exists" });
    }

    const lang = await Language.create({
      name: normalizedName,
      code: normalizedCode,
      locale,
      flag
    });

    res.json(lang);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Not allowed" });

  await Language.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});


module.exports = router;