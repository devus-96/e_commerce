import { getBrand } from "@/api/endpoint/brand";
import { BrandFormData } from "@/types/forms";
import JsonFaker from "json-faker";
import { renderHook, act } from '@testing-library/react-hooks';
// Définir le schéma pour BrandFormData
const brandSchema = {
  _id: "{{datatype.uuid}}",
  name: "{{company.companyName}}",
  slug: "{{lorem.slug}}",
  description: "{{lorem.paragraph}}",
  image: "{{image.imageUrl}}",
  status: "{{random.arrayElement(['draft', 'publish', 'archive'])}}",
  user_id: "{{datatype.uuid}}",
  createdAt: "{{date.past}}",
};

// Générer des données aléatoires
export const fakeBrand: BrandFormData = jsonFaker.generate(brandSchema);

getBrand()