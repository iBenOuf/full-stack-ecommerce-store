const Address = require("../models/address.model");
const Joi = require("joi");
const mongoose = require("mongoose");

const selectQuery = "-__v";

exports.getMyAddresses = async (req, res) => {
    const userId = req.user._id;
    const addresses = await Address.find({ user: userId }).select(selectQuery);
    res.status(200).json({
        message: "Addresses fetched successfully",
        data: addresses,
    });
};

exports.getAddressById = async (req, res) => {
    const addressId = req.params.id;
    const userId = req.user._id;
    const address = await Address.findOne({
        _id: addressId,
        user: userId,
    }).select(selectQuery);
    if (!address) {
        return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({
        message: "Address fetched successfully",
        data: address,
    });
};

const AddressSchema = Joi.object({
    label: Joi.string().max(30).optional(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    governorate: Joi.string().required(),
    isDefault: Joi.boolean().optional(),
});

exports.addAddress = async (req, res) => {
    const userId = req.user._id;

    const { error, value } = AddressSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { label, street, city, governorate, isDefault } = value;

    try {
        if (isDefault) {
            await Address.updateMany({ user: userId }, { isDefault: false });
        }

        const count = await Address.countDocuments({ user: userId });
        const address = await Address.create({
            user: userId,
            ...(label && { label }),
            street,
            city,
            governorate,
            isDefault: isDefault || count === 0,
        });

        return res.status(201).json({
            message: "Address added successfully",
            data: address,
        });
    } catch (error) {
        console.error("ADD ADDRESS ERROR:", error);
        return res
            .status(500)
            .json({ message: error.message || "Internal server error" });
    }
};

exports.updateAddress = async (req, res) => {
    const userId = req.user._id;
    const addressId = req.params.id;

    const { error, value } = AddressSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { label, street, city, governorate, isDefault } = value;

    try {
        if (isDefault) {
            await Address.updateMany({ user: userId }, { isDefault: false });
        }

        const address = await Address.findOneAndUpdate(
            { _id: addressId, user: userId },
            {
                ...(label && { label }),
                street,
                city,
                governorate,
                ...(isDefault !== undefined && { isDefault }),
            },
            { new: true, runValidators: true },
        ).select(selectQuery);
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        return res.status(200).json({
            message: "Address updated successfully",
            data: address,
        });
    } catch (error) {
        console.error("UPDATE ADDRESS ERROR:", error);
        return res
            .status(500)
            .json({ message: error.message || "Internal server error" });
    }
};

exports.deleteAddress = async (req, res) => {
    const userId = req.user._id;
    const addressId = req.params.id;
    try {
        const address = await Address.findOneAndDelete({
            _id: addressId,
            user: userId,
        });
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        if (address.isDefault) {
            await Address.findOneAndUpdate(
                { user: userId },
                { isDefault: true },
                { new: true },
            );
        }

        return res.status(200).json({
            message: "Address deleted successfully",
            data: address,
        });
    } catch (error) {
        console.error("DELETE ADDRESS ERROR:", error);
        return res
            .status(500)
            .json({ message: error.message || "Internal server error" });
    }
};

exports.setDefaultAddress = async (req, res) => {
    const userId = req.user._id;
    const addressId = req.params.id;
    try {
        await Address.updateMany({ user: userId }, { isDefault: false });

        const address = await Address.findOneAndUpdate(
            { _id: addressId, user: userId },
            { isDefault: true },
            { new: true },
        );
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        return res.status(200).json({
            message: "Default address updated",
            data: address,
        });
    } catch (error) {
        console.error("SET DEFAULT ADDRESS ERROR:", error);
        return res
            .status(500)
            .json({ message: error.message || "Internal server error" });
    }
};

async function commitAndEnd(session) {
    await session.commitTransaction();
    await session.endSession();
}

async function abortAndEnd(session) {
    await session.abortTransaction();
    await session.endSession();
}
