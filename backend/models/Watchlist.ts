import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset {
  symbol: string;
  name?: string;
  addedAt?: Date;
}

export interface IWatchlist extends Document {
  user: mongoose.Types.ObjectId;
  assets: IAsset[];
}

const WatchlistSchema = new Schema<IWatchlist>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assets: [
    {
      symbol: { type: String, required: true },
      name: String,
      addedAt: { type: Date, default: Date.now },
    },
  ],
});

const Watchlist = mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
export default Watchlist;
