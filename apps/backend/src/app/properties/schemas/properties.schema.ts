import { model, Schema } from 'mongoose';
import { Coordinates, DatabaseModelEnums, Property, PropertyElectricityEnum, PropertyFeatures, PropertyWaterEnum } from '@newmbani/types';
import { BaseSchema } from '../../database/schemas/base.schema';


const CoordinatesSchema = new Schema<Coordinates>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const propertyFeaturesSchema = new Schema<PropertyFeatures>(
  {
    water: { type: String, enum:PropertyWaterEnum, required: true },
    electricity: { type: String, enum:PropertyElectricityEnum, required: true },
    security: { type: String,  required: true },
  },
  { _id: false }
);



export const PropertySchema = new Schema<Property>({
  landlordId: { type: String, required: true, trim: true },
  categoryId: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  rentPrice: { type: Number, required: true },
  deposit: { type: Number, required: true },
  isAvailable: { type: Boolean, required: true },
  availableUnits: { type: Number, required: true },
  propertyType: { type: String, required: true, trim: true },
  address: { 
    countryId: { type: String, required: true, trim: true },
    county: { type: String, required: true, trim: true },
    town: { type: String, required: false, trim: true },
    street: { type: String, required: false, trim: true },
    building: { type: String, required: false, trim: true }
  },
  images: { type: [String], required: false, trim: true },
  approvalStatus: { type: String, required: true, trim: true },

    // Location
    map: CoordinatesSchema,
    // features
    features: propertyFeaturesSchema,
  // extend the base schema
  ...BaseSchema.obj,
});

export const PropertyModel = model<Property>(
  DatabaseModelEnums.PROPERTY,
  PropertySchema
);