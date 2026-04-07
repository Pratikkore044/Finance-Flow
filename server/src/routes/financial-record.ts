import express, {Request, Response, Router} from 'express';
import FinancialRecordModel from '../schema/financial-record';


const router = express.Router();

router.get("/getAllByUserID/:userId", async (req:Request, res:Response)=>{
    try {
        const {userId} = req.params;
         const records = await FinancialRecordModel.find({ userId });
        // if (records.length === 0){
        //     return res.status(404).send("No records found for the user")
        // }
        res.status(200).send(records)
    } catch (err) {
        res.status(500).send(err);
    }
});


router.post("/", async (req:Request, res:Response)=>{
    try {
        const newRecordBody = req.body;
        const newRecords = new FinancialRecordModel(newRecordBody)
        const savedRecord = await newRecords.save();
        if(req.body.length === 0){
            return res.status(404).send("Invalid request please provide input")
        }
        res.status(200).send(savedRecord);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.put("/:id", async (req:Request, res:Response)=>{
    try {
        const id = req.params.id;
        const newRecordBody = req.body;
        const record = await FinancialRecordModel.findByIdAndUpdate(
            id,
            newRecordBody,
            {new:true}
        )
        
        if(!record)
            return res.status(404).send("Invalid request")
        res.status(200).send(record);
    } catch (err) {
        res.status(500).send(err);
    }
})


router.delete("/:id", async (req:Request, res:Response)=>{
    try {
        const id = req.params.id;
        const record = await FinancialRecordModel.findByIdAndDelete(id);
         if(!record)
            return res.status(404).send("Invalid request")
        
        res.status(200).send(record);
    } catch (err) {
        res.status(500).send(err);
    }
})

export default router;