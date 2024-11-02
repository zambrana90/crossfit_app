'use server';

import Train from '@/database/train.model';
import { connectToDatabase } from '../mongoose';
import { FilterQuery } from 'mongoose';

export async function getAllTrains() {
  try {
    connectToDatabase();

    const trains = await Train.find().limit(9);
    return { trains };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getBootcampTrains() {
  try {
    connectToDatabase();

    const query: FilterQuery<typeof Train> = {
      $or: [
        {
          wod_class: { $regex: new RegExp('bootcamp', 'i') },
        },
      ],
    };

    const trains = await Train.find(query).limit(9);
    return { trains };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getWodTrains() {
  try {
    connectToDatabase();

    const query: FilterQuery<typeof Train> = {
      $or: [
        {
          wod_class: { $regex: new RegExp('wod', 'i') },
        },
      ],
    };

    const trains = await Train.find(query).limit(9);
    return { trains };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getD45Trains() {
  try {
    connectToDatabase();

    const query: FilterQuery<typeof Train> = {
      $or: [
        {
          wod_class: { $regex: new RegExp('d45', 'i') },
        },
      ],
    };

    const trains = await Train.find(query).limit(9);
    return { trains };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
