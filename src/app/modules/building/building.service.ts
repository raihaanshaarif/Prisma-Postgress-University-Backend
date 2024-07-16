import { Building, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { buildingSearchableFields } from './building.constant';
import { IBuildingFilterRequest } from './building.interface';

const insertIntoDB = async (payload: Building): Promise<Building> => {
  const result = await prisma.building.create({
    data: payload,
  });
  return result;
};

const getFromDB = async (
  filters: IBuildingFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Building[]>> => {
  // Destructure pagination options to get page, limit, and skip values
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  // Destructure filters to separate searchTerm from other filter data
  const { searchTerm, ...filterData } = filters;
  // Initialize an array to hold the conditions for the query
  const andConditons = [];

  // If a search term is provided, add a condition for searching across multiple fields
  if (searchTerm) {
    andConditons.push({
      OR: buildingSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive', // Case-insensitive search
        },
      })),
    });
  }

  // If other filters are provided, add them as exact match conditions
  if (Object.keys(filterData).length > 0) {
    andConditons.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  // Create the final where condition object for the Prisma query
  const whereConditons: Prisma.BuildingWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  // Perform the database query with Prisma
  const result = await prisma.building.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc', // Default sort order by creation date
          },
  });

  // Count the total number of records in the Building table
  const total = await prisma.building.count();

  // Return the response with metadata and the retrieved data
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Building | null> => {
  const result = await prisma.building.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<Building>
): Promise<Building> => {
  const result = await prisma.building.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Building> => {
  const result = await prisma.building.delete({
    where: {
      id,
    },
  });
  return result;
};

export const BuildingServices = {
  insertIntoDB,
  getFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
