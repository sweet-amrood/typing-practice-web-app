import { setActiveTitle, syncProgressTitles } from '../services/titleService.js';

export const getTitles = async (req, res) => {
  try {
    const { titleData } = await syncProgressTitles(req.user._id);

    res.status(200).json({
      success: true,
      data: titleData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTitle = async (req, res) => {
  try {
    const { titleId } = req.body;

    if (!titleId) {
      return res.status(400).json({
        success: false,
        message: 'titleId is required',
      });
    }

    const titleData = await setActiveTitle(req.user._id, titleId);

    res.status(200).json({
      success: true,
      message: 'Title updated',
      data: titleData,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
