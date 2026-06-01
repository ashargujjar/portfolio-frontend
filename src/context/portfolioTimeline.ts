export type EducationItem = {
  id: string;
  degree: string;
  school: string;
  year: string;
  isDraft?: boolean;
};

export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  isDraft?: boolean;
};

type EducationSource = Partial<EducationItem> & { _id?: string };
type ExperienceSource = Partial<ExperienceItem> & {
  _id?: string;
  desc?: string;
};

const educationStorageKey = "portfolio.education";
const experienceStorageKey = "portfolio.experience";
const legacyEducationSeed = [
  {
    degree: "BS in Computer Science",
    school: "Global Tech University",
    year: "2020 - 2024",
  },
  {
    degree: "Intermediate in Pre-Engineering",
    school: "City College",
    year: "2018 - 2020",
  },
];
const legacyExperienceSeed = [
  {
    role: "Full Stack Developer Intern",
    company: "DevSync Solutions",
    period: "2023 - Present",
    description: "Building scalable MERN applications.",
  },
  {
    role: "Open Source Contributor",
    company: "GitHub Community",
    period: "2022 - 2023",
    description: "Contributed to various AI libraries.",
  },
];

const createDraftId = () =>
  `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const normalizeEducationItem = (
  item: EducationSource,
): EducationItem => ({
  id: String(item._id ?? item.id ?? createDraftId()),
  degree: item.degree ?? "",
  school: item.school ?? "",
  year: item.year ?? "",
  isDraft: item.isDraft ?? false,
});

export const normalizeExperienceItem = (
  item: ExperienceSource,
): ExperienceItem => ({
  id: String(item._id ?? item.id ?? createDraftId()),
  role: item.role ?? "",
  company: item.company ?? "",
  period: item.period ?? "",
  description: item.description ?? item.desc ?? "",
  isDraft: item.isDraft ?? false,
});

export const createEducationDraft = (): EducationItem => ({
  id: createDraftId(),
  degree: "",
  school: "",
  year: "",
  isDraft: true,
});

export const createExperienceDraft = (): ExperienceItem => ({
  id: createDraftId(),
  role: "",
  company: "",
  period: "",
  description: "",
  isDraft: true,
});

const canUseStorage = () => typeof window !== "undefined";

const readStorage = <T,>(key: string): T | null => {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage`, error);
    return null;
  }
};

const writeStorage = (key: string, value: unknown) => {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write ${key} to localStorage`, error);
  }
};

const removeStorage = (key: string) => {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove ${key} from localStorage`, error);
  }
};

const matchesLegacyEducationSeed = (items: EducationItem[]) =>
  items.length === legacyEducationSeed.length &&
  items.every((item, index) => {
    const legacyItem = legacyEducationSeed[index];
    return (
      item.degree === legacyItem.degree &&
      item.school === legacyItem.school &&
      item.year === legacyItem.year
    );
  });

const matchesLegacyExperienceSeed = (items: ExperienceItem[]) =>
  items.length === legacyExperienceSeed.length &&
  items.every((item, index) => {
    const legacyItem = legacyExperienceSeed[index];
    return (
      item.role === legacyItem.role &&
      item.company === legacyItem.company &&
      item.period === legacyItem.period &&
      item.description === legacyItem.description
    );
  });

export const loadEducationState = (
  fallback: EducationItem[],
): EducationItem[] => {
  const stored = readStorage<EducationSource[]>(educationStorageKey);

  if (!stored?.length) {
    return fallback;
  }

  const normalized = stored.map(normalizeEducationItem);

  if (matchesLegacyEducationSeed(normalized)) {
    removeStorage(educationStorageKey);
    return fallback;
  }

  return normalized;
};

export const loadExperienceState = (
  fallback: ExperienceItem[],
): ExperienceItem[] => {
  const stored = readStorage<ExperienceSource[]>(experienceStorageKey);

  if (!stored?.length) {
    return fallback;
  }

  const normalized = stored.map(normalizeExperienceItem);

  if (matchesLegacyExperienceSeed(normalized)) {
    removeStorage(experienceStorageKey);
    return fallback;
  }

  return normalized;
};

export const persistEducationState = (items: EducationItem[]) => {
  writeStorage(
    educationStorageKey,
    items
      .filter((item) => !item.isDraft)
      .map(({ id, degree, school, year }) => ({ id, degree, school, year })),
  );
};

export const persistExperienceState = (items: ExperienceItem[]) => {
  writeStorage(
    experienceStorageKey,
    items
      .filter((item) => !item.isDraft)
      .map(({ id, role, company, period, description }) => ({
        id,
        role,
        company,
        period,
        description,
      })),
  );
};
