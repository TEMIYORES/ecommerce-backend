import Review from "../../model/Review.js";

const getAllReviews = async (req, res) => {
  const { storeId, productId } = req.params;
  if (!storeId || !productId) {
    return res
      .status(400)
      .json({ message: "Store Id and Account Id required." });
  }
  const allReviews = await Review.findOne({ storeId, productId }).populate(
    "reviews.account"
  );
  if (!allReviews) return res.status(200).json([]);
  const result = allReviews.reviews
    .map((review) => {
      return {
        fullName: review.account.fullName,
        rating: review.rating,
        title: review.title,
        description: review.description,
        createdAt: review.createdAt,
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.status(200).json(result);
};
const saveReview = async (req, res) => {
  const { storeId, accountId, productId, title, description, rating } =
    req.body;
  if (!storeId || !accountId || !productId) {
    return res
      .status(400)
      .json({ message: "Store Id, account Id and productId are required." });
  }
  const findReview = await Review.findOne({ storeId, productId }).exec();
  if (findReview) {
    findReview.reviews.push({
      title,
      rating,
      description,
      account: accountId,
    });
    await findReview.save();
  } else {
    const newReview = await Review.create({
      storeId,
      productId,
    });
    newReview.reviews.push({
      title,
      description,
      account: accountId,
      rating,
    });
    await newReview.save();
  }
  res.status(200).json({ message: "Thanks for your review!" });
};

export { getAllReviews, saveReview };
