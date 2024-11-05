'use server';

import Train from '@/database/train.model';
import { connectToDatabase } from '../mongoose';
import { FilterQuery } from 'mongoose';
import { GetTrainsParams } from './shared.types';

export async function getAllTrains(params: GetTrainsParams) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 3 } = params;

    const skipAmount = (page - 1) * pageSize;

    const trains = await Train.find().skip(skipAmount).limit(pageSize);

    const totalTrains = await Train.countDocuments();

    const isNext = totalTrains > skipAmount + trains.length;

    return { trains, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getBootcampTrains(params: GetTrainsParams) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 3 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Train> = {
      $or: [
        {
          wod_class: { $regex: new RegExp('bootcamp', 'i') },
        },
      ],
    };

    const trains = await Train.find(query).skip(skipAmount).limit(pageSize);

    const totalTrains = await Train.countDocuments(query);

    const isNext = totalTrains > skipAmount + trains.length;

    return { trains, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getWodTrains(params: GetTrainsParams) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 3 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Train> = {
      $or: [
        {
          wod_class: { $regex: new RegExp('wod', 'i') },
        },
      ],
    };

    const trains = await Train.find(query).skip(skipAmount).limit(pageSize);

    const totalTrains = await Train.countDocuments(query);

    const isNext = totalTrains > skipAmount + trains.length;

    return { trains, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getD45Trains(params: GetTrainsParams) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 3 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Train> = {
      $or: [
        {
          wod_class: { $regex: new RegExp('d45', 'i') },
        },
      ],
    };

    const trains = await Train.find(query).skip(skipAmount).limit(pageSize);

    const totalTrains = await Train.countDocuments(query);

    const isNext = totalTrains > skipAmount + trains.length;

    return { trains, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPartnerTrains(params: GetTrainsParams) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 3 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Train> = {
      wod: { $elemMatch: { description: { $regex: /partner/i } } },
    };

    const trains = await Train.find(query).skip(skipAmount).limit(pageSize);

    const totalTrains = await Train.countDocuments(query);

    const isNext = totalTrains > skipAmount + trains.length;

    return { trains, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRandomTrains() {
  try {
    connectToDatabase();

    const trains = await Train.find();

    const randomIndex = Math.floor(Math.random() * trains.length);
    const randomTrainDay = trains[randomIndex].day;

    const randomTrains = trains.filter((train) => {
      return train.day === randomTrainDay;
    });

    return randomTrains;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
