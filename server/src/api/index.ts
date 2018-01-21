
import * as express from 'express';
import { Request, Response } from 'express';
import * as mongoose from 'mongoose';
import { ILabelModel } from '../models/Label';
import { IMemoModel } from '../models/Memo';

const router = express.Router();
const Label = mongoose.model<ILabelModel>('Label');
const Memo = mongoose.model<IMemoModel>('Memo');

const updateLabelsMemoCount = async (labelIds: Array<string>) => {  
  try {
    labelIds.forEach(async(labelId) => {
      const label = await Label.findById(labelId);

    
      if (!label) {
        throw new Error(`${labelId} label not found.`);
      }
    
      const memoCount = await Memo.count({ isDisplay: true, labels: { $in: [label._id]}});;
      
      label.memoCount = memoCount;
      
      await label.save();  

      console.log(`${label.name} : ${label.memoCount}`);
    });
  } catch (e) {
    console.error(e);
  }
};

const syncLabelsMemoCount = async () => {
  const labels = await Label.find();
  const labelIds = labels.map((label) => label._id);

  await updateLabelsMemoCount(labelIds);
};



// label
router.get('/labels', async (req: Request, res: Response) => {
  try {
    const labels = await Label.find({ isDisplay: true });

    return res.json({
      labels
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
});

router.post('/labels', async (req, res) => {
  try {
    const { name } = req.body;

    const label = new Label({
      name
    });

    await label.save();

    return res.json({
      createdLabel: label
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }  
});

router.put('/labels/:labelId', async (req, res) => {
  try {
    const { labelId } = req.params;
    const { name } = req.body;

    const label = await Label.findById(labelId);

    if (!label) {
      return res.status(404).json({ message: `${labelId} not found.`});
    }

    label.name = name;

    await label.save();

    return res.json({
      updatedLabel: label
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
});

router.delete('/labels/:labelId', async (req:Request, res:Response) => {
  try {
    const { labelId  } = req.params;
    const label = await Label.findById(labelId);

    if (!label) {
      return res.status(404).json({
        message: `${labelId} not found.`
      });
    }

    label.isDisplay = false;
    await label.save();

    // remove memo's label
    const memos = await Memo.find({ 
      labels:{ 
        $in: [labelId]
      }
    });

    if (memos && memos.length > 0) {
      memos.forEach(async (memo) => {
        const index = memo.labels.indexOf(labelId);
        if (index > -1) {
          memo.labels = memo.labels.splice(index, 1);
          await memo.save();
        } 
      });
    }

    return res.json({
      isRemoved: true
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
});

// memo
router.get('/memos', async (req, res) => {
  try {
    const query:any = {
      isDisplay: true
    };

    if (req.query.labelId) {
      query.labels = {
        $in: [req.query.labelId]
      }
    }

    const memos = await Memo.find(query).populate('labels', '_id name').sort({ updatedAt: -1 });
    return res.json({
      memos
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
});

router.get('/memos/count', async(req:Request, res:Response) => {
  try {
    const query:any = {
      isDisplay: true
    };

    if (req.query.labelId) {
      query.labels = {
        $in: [req.query.labelId]
      }
    }

    const count = await Memo.count(query);
    return res.json({
      count
    });

  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
});

router.post('/memos', async (req:Request, res:Response) => {
  try {   
    const { title, content, labels = []} = req.body;
    
    const memo = new Memo({
      title,
      content,
      labels
    });

    await memo.save();

    if (labels.length > 0) {
      labels.forEach(async (labelId: number) => {
        // update label
        const label = await Label.findById(labelId);

        if (!label) {
          throw new Error(`${labelId} label not found.`);
        }

        label.memoCount = await Memo.count({ isDisplay: true, labels: { $in: [labelId]}});

        await label.save();
      });      
    }
    
    return res.json({
      createdMemo: memo
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message
    });
  }  
});

router.put('/memos', async (req, res) => {
  try {
    const { memoIds, labelIds } = req.body;

    if (!memoIds || memoIds.length === 0) {
      throw new Error('invalid memoIds.');
    }

    const works = memoIds.map((memoId:number) => {
      return new Promise((resolve, reject) => {
        return Memo.findById(memoId)
          .then((memo) => {            
            memo.labels = labelIds;
            memo.save().then(resolve);
          });
      });
    });

    Promise.all(works).then(async () => {
      await syncLabelsMemoCount();
      return res.json({
        isUpdated: true
      });
    });  
  } catch (e) {
    return res.status(500).json({
      error: e.message
    });
  }
});

router.put('/memos/:memoId', async (req, res) => {
  try {
    const { memoId } = req.params;

    if (!memoId) {
      throw new Error('invalid memoId.');
    }

    const memo = await Memo.findById(memoId);

    if (!memo) {
      return res.status(404).json({
        error: `${memoId} memo not found.`
      });
    }

    const { title, content, labels } = req.body;

    memo.title = title;
    memo.content = content;
    
    if (labels) {
      memo.labels = labels;
    }
    memo.updatedAt = new Date();

    await memo.save();

    return res.json({
      updatedMemo: memo
    });
    
  } catch (e) {
    return res.status(500).json({
      error: e.message
    }); 
  }
});

router.delete('/memos/:memoId', async (req:Request, res:Response) => {
  try {
    const { memoId } = req.params;

    const memo = await Memo.findById(memoId);

    if (!memo) {
      return res.status(404).json({
        message: `${memoId} memo not found.`
      });
    }
    
    const labelIds: Array<any> = [...memo.labels];

    memo.isDisplay = false;
    memo.labels = [];

    await memo.save();
       
    await updateLabelsMemoCount(labelIds);

    return res.json({
      isRemoved: true
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message
    });
  }
});

router.delete('/memos/:memoId/labels/:labelId', async (req, res) => {
  try {
    const { memoId, labelId } = req.params;

    const memo = await Memo.findById(memoId);

    if (!memo) {
      return res.status(404).json({
        message: `${memoId} memo not found.`
      });
    }

    const removeLabelIndex = memo.labels.indexOf(labelId);

    if (removeLabelIndex > -1) {
      memo.labels.splice(removeLabelIndex, 1);

      await memo.save();
    }

    // label count update
    await syncLabelsMemoCount();

    // label populate and return
    const updatedMemo = await Memo.findById(memoId).populate('labels', '_id name');
    
    return res.json({
      updatedMemo
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message
    });
  }

});

module.exports = router;