const InstitutionalPolicy = require('../models/InstitutionalPolicy');

// Get active policy (or most recent)
exports.getActive = async (req, res, next) => {
  try {
    let policy = await InstitutionalPolicy.findOne({ active: true }).sort({ updatedAt: -1 });
    if (!policy) {
      // Create default policy if none exists
      policy = await InstitutionalPolicy.create({});
    }
    res.json(policy);
  } catch (error) {
    next(error);
  }
};

// Get all policies
exports.getAll = async (req, res, next) => {
  try {
    const policies = await InstitutionalPolicy.find().sort({ updatedAt: -1 });
    res.json({ count: policies.length, policies });
  } catch (error) {
    next(error);
  }
};

// Create new policy
exports.create = async (req, res, next) => {
  try {
    // Deactivate existing policies if creating a new active one
    if (req.body.active !== false) {
      await InstitutionalPolicy.updateMany({}, { active: false });
    }
    const policy = await InstitutionalPolicy.create(req.body);
    res.status(201).json({ message: 'Política institucional creada.', policy });
  } catch (error) {
    next(error);
  }
};

// Update policy
exports.update = async (req, res, next) => {
  try {
    // If activating this policy, deactivate others
    if (req.body.active === true) {
      await InstitutionalPolicy.updateMany(
        { _id: { $ne: req.params.id } },
        { active: false }
      );
    }
    const policy = await InstitutionalPolicy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!policy) return res.status(404).json({ message: 'Política no encontrada.' });
    res.json({ message: 'Política actualizada.', policy });
  } catch (error) {
    next(error);
  }
};

// Delete policy
exports.delete = async (req, res, next) => {
  try {
    const policy = await InstitutionalPolicy.findByIdAndDelete(req.params.id);
    if (!policy) return res.status(404).json({ message: 'Política no encontrada.' });
    res.json({ message: 'Política eliminada.' });
  } catch (error) {
    next(error);
  }
};
