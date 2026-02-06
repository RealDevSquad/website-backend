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

const buildApplicationUpdatePayload = (body: applicationUpdatePayload) => {
  const dataToUpdate: applicationUpdatePayload = {};

  if (body.imageUrl) dataToUpdate.imageUrl = body.imageUrl;
  if (body.foundFrom) dataToUpdate.foundFrom = body.foundFrom;

  if (body.introduction) dataToUpdate["intro.introduction"] = body.introduction;
  if (body.forFun) dataToUpdate["intro.forFun"] = body.forFun;
  if (body.funFact) dataToUpdate["intro.funFact"] = body.funFact;
  if (body.whyRds) dataToUpdate["intro.whyRds"] = body.whyRds;
  if (body.numberOfHours) dataToUpdate["intro.numberOfHours"] = body.numberOfHours;

  if (body.professional && typeof body.professional === "object") {
    if (body.professional.institution) dataToUpdate["professional.institution"] = body.professional.institution;
    if (body.professional.skills) dataToUpdate["professional.skills"] = body.professional.skills;
  }

  if (body.socialLink && typeof body.socialLink === "object") {
    if (body.socialLink.phoneNo) dataToUpdate["socialLink.phoneNo"] = body.socialLink.phoneNo;
    if (body.socialLink.github) dataToUpdate["socialLink.github"] = body.socialLink.github;
    if (body.socialLink.instagram) dataToUpdate["socialLink.instagram"] = body.socialLink.instagram;
    if (body.socialLink.linkedin) dataToUpdate["socialLink.linkedin"] = body.socialLink.linkedin;
    if (body.socialLink.twitter) dataToUpdate["socialLink.twitter"] = body.socialLink.twitter;
    if (body.socialLink.peerlist) dataToUpdate["socialLink.peerlist"] = body.socialLink.peerlist;
    if (body.socialLink.behance) dataToUpdate["socialLink.behance"] = body.socialLink.behance;
    if (body.socialLink.dribbble) dataToUpdate["socialLink.dribbble"] = body.socialLink.dribbble;
  }

  return dataToUpdate;
};

module.exports = { getUserApplicationObject, buildApplicationUpdatePayload }
