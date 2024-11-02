import { Schema, models, model, Document } from 'mongoose';

export interface ITrain extends Document {
  wod_class: string;
  day: number;
  wod: {
    id: string;
    title: string;
    rounds: string | null;
    description: string;
    exercises: {
      id: string;
      reps: string;
      name: string;
      img: string;
      wod: number;
      weight: string;
    }[];
  }[];
}

const TrainSchema = new Schema({
  wod_class: { type: String, required: true },
  day: { type: Number, required: true },
  wod: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      rounds: { type: String },
      description: { type: String, required: true },
      exercises: [
        {
          id: { type: String, required: true },
          reps: { type: String },
          name: { type: String },
          img: { type: String },
          wod: { type: Number },
          weight: { type: String },
        },
      ],
    },
  ],
});

const Train = models.Train || model('Train', TrainSchema);

export default Train;
