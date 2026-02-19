import { NextFunction } from "express";
import { CustomRequest, CustomResponse } from "../../types/global";
import { customWordCountValidator } from "../../utils/customWordCountValidator";
const joi = require("joi");
const { APPLICATION_STATUS_TYPES, APPLICATION_ROLES } = require("../../constants/application");
const { phoneNumberRegex } = require("../../constants/subscription-validator");
const logger = require("../../utils/logger");

const socialLinkSchema = joi
  .object({
    phoneNumber: joi.string().optional().regex(phoneNumberRegex).message('"phoneNumber" must be in a valid format'),
    github: joi.string().min(1).optional(),
    instagram: joi.string().min(1).optional(),
    linkedin: joi.string().min(1).optional(),
    twitter: joi.string().min(1).optional(),
    peerlist: joi.string().min(1).optional(),
    behance: joi.string().min(1).optional(),
    dribbble: joi.string().min(1).optional(),
  })
  .optional();

const validateApplicationData = async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
  if (req.body.socialLink?.phoneNumber) {
    req.body.socialLink.phoneNumber = req.body.socialLink.phoneNumber.trim();
  }

  const schema = joi
    .object()
    .strict()
    .keys({
      userId: joi.string().optional(),
      firstName: joi.string().min(1).required(),
      lastName: joi.string().min(1).required(),
      institution: joi.string().min(1).required(),
      skills: joi.string().min(5).required(),
      city: joi.string().min(1).required(),
      state: joi.string().min(1).required(),
      country: joi.string().min(1).required(),
      foundFrom: joi.string().min(1).required(),
      introduction: joi.string().min(1).required(),
      forFun: joi
        .string()
        .custom((value, helpers) => customWordCountValidator(value, helpers, 100))
        .required(),
      funFact: joi
        .string()
        .custom((value, helpers) => customWordCountValidator(value, helpers, 100))
        .required(),
      whyRds: joi
        .string()
        .custom((value, helpers) => customWordCountValidator(value, helpers, 100))
        .required(),
      flowState: joi.string().optional(),
      numberOfHours: joi.number().min(1).max(100).required(),
      role: joi
        .string()
        .valid(...Object.values(APPLICATION_ROLES))
        .required(),
      imageUrl: joi.string().uri().required(),
      socialLink: socialLinkSchema,
    });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    logger.error(`Error in validating application data: ${error}`);
    return res.boom.badRequest(error.details[0].message);
  }
};

const validateApplicationFeedbackData = async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
  const schema = joi
  .object({
    status: joi
      .string()
      .valid(
        APPLICATION_STATUS_TYPES.ACCEPTED,
        APPLICATION_STATUS_TYPES.REJECTED,
        APPLICATION_STATUS_TYPES.CHANGES_REQUESTED
      )
      .required()
      .messages({
        "any.required": "Status is required",
        "any.only":
          "Status must be one of: accepted, rejected, or changes_requested",
      }),

    feedback: joi.when("status", {
      is: APPLICATION_STATUS_TYPES.CHANGES_REQUESTED,
      then: joi
        .string()
        .min(1)
        .required()
        .messages({
          "any.required":
            "Feedback is required when status is changes_requested",
          "string.min":
            "Feedback cannot be empty when status is changes_requested",
        }),
      otherwise: joi.string().optional().allow(""),
    }),
  })
  .strict();


  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    logger.error(`Error in validating recruiter data: ${error}`);
    return res.boom.badRequest(error.details[0].message);
  }
};

const validateApplicationUpdateData = async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
  if (req.body.socialLink?.phoneNumber) {
    req.body.socialLink.phoneNumber = req.body.socialLink.phoneNumber.trim();
  }

  const professionalSchema = joi
    .object({
      institution: joi.string().min(1).optional(),
      skills: joi.string().min(5).optional(),
    })
    .optional();

  const schema = joi
    .object()
    .strict()
    .min(1)
    .keys({
      institution: joi.string().min(1).optional(),
      skills: joi.string().min(5).optional(),
      city: joi.string().min(1).optional(),
      state: joi.string().min(1).optional(),
      country: joi.string().min(1).optional(),
      role: joi
        .string()
        .valid(...Object.values(APPLICATION_ROLES))
        .optional(),
      imageUrl: joi.string().uri().optional(),
      foundFrom: joi.string().min(1).optional(),
      introduction: joi.string().min(1).optional(),
      forFun: joi
        .string()
        .custom((value, helpers) => customWordCountValidator(value, helpers, 100))
        .optional(),
      funFact: joi
        .string()
        .custom((value, helpers) => customWordCountValidator(value, helpers, 100))
        .optional(),
      whyRds: joi
        .string()
        .custom((value, helpers) => customWordCountValidator(value, helpers, 100))
        .optional(),
      numberOfHours: joi.number().min(1).max(168).optional(),
      professional: professionalSchema,
      socialLink: socialLinkSchema,
    })
    .messages({
      "object.min": "Update payload must contain at least one allowed field.",
    });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    logger.error(`Error in validating application update data: ${error}`);
    return res.boom.badRequest(error.details[0].message);
  }
};

const validateApplicationQueryParam = async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
  const schema = joi.object().strict().keys({
    userId: joi.string().optional(),
    status: joi.string().optional(),
    size: joi.string().optional(),
    next: joi.string().optional(),
    dev: joi.string().optional(),
  });

  try {
    await schema.validateAsync(req.query);
    next();
  } catch (error) {
    logger.error(`Error validating query params : ${error}`);
    return res.boom.badRequest(error.details[0].message);
  }
};

module.exports = {
  validateApplicationData,
  validateApplicationFeedbackData,
  validateApplicationUpdateData,
  validateApplicationQueryParam,
};
