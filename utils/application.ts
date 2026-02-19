import { applicationPayload, application, applicationUpdatePayload } from "../types/application";

const getUserApplicationObject = (rawData: applicationPayload, userId: string, createdAt: string): application => {
  const data = {
    userId,
    biodata: {
      firstName: rawData.firstName,
      lastName: rawData.lastName,
    },
    location: {
      city: rawData.city,
      state: rawData.state,
      country: rawData.country,
    },
    professional: {
      institution: rawData.college,
      skills: rawData.skills,
    },
    intro: {
      introduction: rawData.introduction,
      funFact: rawData.funFact,
      forFun: rawData.forFun,
      whyRds: rawData.whyRds,
      numberOfHours: rawData.numberOfHours,
    },
    foundFrom: rawData.foundFrom,
    status: "pending",
    createdAt,
  };
  return data;
};

const FLAT_FIELD_MAP: Record<keyof Omit<applicationUpdatePayload, "professional" | "socialLink">, string> = {
  city: "location.city",
  state: "location.state",
  country: "location.country",
  college: "professional.institution",
  skills: "professional.skills",
  role: "role",
  imageUrl: "imageUrl",
  foundFrom: "foundFrom",
  introduction: "intro.introduction",
  forFun: "intro.forFun",
  funFact: "intro.funFact",
  whyRds: "intro.whyRds",
  numberOfHours: "intro.numberOfHours",
};

const PROFESSIONAL_KEYS = ["institution", "skills"] as const;
const SOCIAL_LINK_KEYS = ["phoneNumber", "github", "instagram", "linkedin", "twitter", "peerlist", "behance", "dribbble"] as const;

const buildApplicationUpdatePayload = (body: applicationUpdatePayload): Record<string, string | number | undefined> => {
  const dataToUpdate: Record<string, string | number | undefined> = {};

  Object.entries(FLAT_FIELD_MAP).forEach(([key, path]) => {
    const value = body[key as keyof typeof FLAT_FIELD_MAP];
    if (value != null) {
      dataToUpdate[path] = value;
    }
  });

  if (body.professional && typeof body.professional === "object") {
    PROFESSIONAL_KEYS.forEach((key) => {
      const value = body.professional![key];
      if (value != null) {
        dataToUpdate[`professional.${key}`] = value;
      }
    });
  }

  if (body.socialLink && typeof body.socialLink === "object") {
    SOCIAL_LINK_KEYS.forEach((key) => {
      const value = body.socialLink![key];
      if (value != null) {
        dataToUpdate[`socialLink.${key}`] = value;
      }
    });
  }

  return dataToUpdate;
};

module.exports = { getUserApplicationObject, buildApplicationUpdatePayload }
