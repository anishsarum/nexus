import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction {
  type: 'buy' | 'sell';
  symbol: string;
  quantity: number;
  price: number;
  date?: Date;
}

export interface IHolding {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

export interface IPortfolio extends Document {
  user: mongoose.Types.ObjectId;
  cash: number;
  holdings: IHolding[];
  transactions: ITransaction[];
}

const TransactionSchema = new Schema<ITransaction>({
  type: { type: String, enum: ['buy', 'sell'], required: true },
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const PortfolioSchema = new Schema<IPortfolio>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cash: { type: Number, default: 100000 },
  holdings: [
    {
      symbol: String,
      quantity: Number,
      avgPrice: Number,
    },
  ],
  transactions: [TransactionSchema],
});

const Portfolio = mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
export default Portfolio;
