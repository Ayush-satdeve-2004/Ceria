const mongoose = require('mongoose');
const Banner = require('../models/Banner');
const { uploadMedia } = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

const isMongoReady = () => mongoose.connection.readyState === 1;

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
exports.getBanners = async (req, res, next) => {
  try {
    if (!isMongoReady()) {
      return res.status(200).json({
        success: true,
        count: 0,
        banners: [],
        note: 'Database unavailable'
      });
    }

    const query = {};
    // Admin might want to view inactive ones as well, but for public page, we fetch only active ones.
    // Let's check query parameter. If admin is true, retrieve all.
    if (req.query.admin !== 'true') {
      query.active = true;
    }

    const banners = await Banner.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      banners
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create banner (Admin only)
// @route   POST /api/banners
// @access  Private/Admin
exports.createBanner = async (req, res, next) => {
  try {
    const { title, subtitle, badge, cta, link, active } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide a title' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a banner image' });
    }

    let imageUrl = '';
    const file = req.file;

    // Upload image to Cloudinary
    const cloudinaryUrl = await uploadMedia(file.path, 'ceria/banners');
    if (cloudinaryUrl) {
      imageUrl = cloudinaryUrl;
    } else {
      imageUrl = `/uploads/${path.basename(file.path)}`;
    }

    const banner = await Banner.create({
      title,
      subtitle,
      badge,
      image: imageUrl,
      cta: cta || 'Explore Deal',
      link: link || '/',
      active: active === 'true' || active === true
    });

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      banner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update banner (Admin only)
// @route   PUT /api/banners/:id
// @access  Private/Admin
exports.updateBanner = async (req, res, next) => {
  try {
    let banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    const { title, subtitle, badge, cta, link, active } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (badge !== undefined) updateData.badge = badge;
    if (cta !== undefined) updateData.cta = cta;
    if (link !== undefined) updateData.link = link;
    if (active !== undefined) {
      updateData.active = active === 'true' || active === true;
    }

    if (req.file) {
      // Clean up old local image if any
      if (banner.image && banner.image.startsWith('/uploads/')) {
        const localPath = path.join(__dirname, '..', banner.image);
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      }

      const file = req.file;
      const cloudinaryUrl = await uploadMedia(file.path, 'ceria/banners');
      if (cloudinaryUrl) {
        updateData.image = cloudinaryUrl;
      } else {
        updateData.image = `/uploads/${path.basename(file.path)}`;
      }
    }

    banner = await Banner.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      banner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner (Admin only)
// @route   DELETE /api/banners/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    // Clean up local image if it exists
    if (banner.image && banner.image.startsWith('/uploads/')) {
      const localPath = path.join(__dirname, '..', banner.image);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    }

    await banner.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
