import { Professional } from '@/types';

export const professionalsData: Professional[] = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    specialty: "Physical Therapy",
    experience: "12+ years",
    rating: 4.9,
    image: "https://kimi-web-img.moonshot.cn/img/media.istockphoto.com/13a2f01cff66d40446dbf22236f6ea98072a3cf5.jpg",
    specializations: ["Sports Injury", "Post-Surgical Rehab", "Chronic Pain"],
    bio: "Dr. Chen specializes in evidence-based physical therapy with a focus on sports injuries and post-surgical rehabilitation. She has helped hundreds of patients achieve optimal recovery outcomes.",
    credentials: [
      "Doctor of Physical Therapy (DPT) - Stanford University",
      "Board Certified Orthopedic Clinical Specialist",
      "Certified in Manual Therapy Techniques"
    ],
    availability: ["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM", "4:00 PM"]
  },
  {
    id: 2,
    name: "Dr. Michael Rodriguez",
    specialty: "Sports Medicine",
    experience: "15+ years",
    rating: 4.8,
    image: "https://kimi-web-img.moonshot.cn/img/media.istockphoto.com/13a2f01cff66d40446dbf22236f6ea98072a3cf5.jpg",
    specializations: ["Athletic Performance", "Injury Prevention", "Rehabilitation"],
    bio: "Dr. Rodriguez is a sports medicine physician with extensive experience in treating athletes of all levels. He combines medical expertise with practical rehabilitation strategies.",
    credentials: [
      "MD Sports Medicine - Johns Hopkins University",
      "Fellowship in Sports Medicine - Mayo Clinic",
      "Team Physician Certification"
    ],
    availability: ["8:00 AM", "9:30 AM", "11:00 AM", "1:00 PM", "2:30 PM"]
  },
  {
    id: 3,
    name: "Dr. Emily Watson",
    specialty: "Rehabilitation Medicine",
    experience: "10+ years",
    rating: 4.9,
    image: "https://kimi-web-img.moonshot.cn/img/media.istockphoto.com/13a2f01cff66d40446dbf22236f6ea98072a3cf5.jpg",
    specializations: ["Neurological Rehab", "Spinal Cord Injury", "Stroke Recovery"],
    bio: "Dr. Watson specializes in comprehensive rehabilitation medicine with expertise in neurological conditions and complex trauma recovery.",
    credentials: [
      "MD Physical Medicine & Rehabilitation - Harvard Medical",
      "Board Certified in Physical Medicine & Rehabilitation",
      "Spinal Cord Injury Medicine Certification"
    ],
    availability: ["10:00 AM", "11:30 AM", "1:30 PM", "3:00 PM", "4:30 PM"]
  },
  {
    id: 4,
    name: "Dr. James Park",
    specialty: "Orthopedic Surgery",
    experience: "18+ years",
    rating: 4.7,
    image: "https://kimi-web-img.moonshot.cn/img/media.istockphoto.com/13a2f01cff66d40446dbf22236f6ea98072a3cf5.jpg",
    specializations: ["Joint Replacement", "Arthroscopic Surgery", "Trauma Surgery"],
    bio: "Dr. Park is a board-certified orthopedic surgeon with expertise in minimally invasive procedures and complex joint reconstruction.",
    credentials: [
      "MD Orthopedic Surgery - UCLA Medical School",
      "Board Certified Orthopedic Surgeon",
      "Fellowship in Joint Replacement Surgery"
    ],
    availability: ["8:30 AM", "10:00 AM", "12:00 PM", "2:00 PM", "3:30 PM"]
  }
];