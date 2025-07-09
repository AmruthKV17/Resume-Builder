import { Resume } from "../models/resume.model";

const createResume = async (req, res) => {
  try {
    const { title } = req.body;

    const defaultResumeData = {
      profileInfo: {
        profileImg: null,
        previewUrl: "",
        fullName: "",
        designation: "",
        summary: "",
      },
      contactInfo: {
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
      },
      workExperience: [
        {
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: [
        {
          degree: "",
          institution: "",
          startDate: "",
          endDate: "",
        },
      ],
      skills: [
        {
          name: "",
          progress: 0,
        },
      ],
      projects: [
        {
          title: "",
          description: "",
          github: "",
          liveDemo: "",
        },
      ],
      certifications: [
        {
          title: "",
          issuer: "",
          year: "",
        },
      ],
      languages: [
        {
          name: "",
          progress: 0,
        },
      ],
      interests: [""],
    };

    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResumeData,
      ...req.body,
    });
    res.status(201).json(newResume);
  } catch (error) {
    res.status(400).json({
      message: "Error in creating Resume",
      error: error.message,
    });
  }
};

const getUserResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const resumes = await Resume.find(userId).sort({
      updatedAt: -1,
    });
    res.json(resumes);
  } catch (error) {
    res.status(400).json({
      message: "Error in getting User Resume",
      error: error.message,
    });
  }
};

const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      res.status(400).json({
        message: "Resume Not Found",
      });
    }
    res.json(resume);
  } catch (error) {
    res.status(400).json({
      message: "Error in getting Resume by Id",
      error: error.message,
    });
  }
};

const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      res
        .status(400)
        .json({ message: "Resume not found or you are not authorized" });
    }

    Object.assign(resume, req.body);
    const savedResume = resume.save();
    res.json(savedResume);
  } catch (error) {
    res.status(400).json({
      message: "Error in updating the resume",
      error: error.message,
    });
  }
};

export { createResume, getUserResume, getResumeById, updateResume };
