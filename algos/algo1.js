import { Router } from "express";
import axios from 'axios';

const router = new Router();

const baseUrl = 'http://localhost:8000/trains/';

const zones = [
    'NR','CR','WR','NER','SR','ER','SER','SCR','SWR','NCR','NWR','SECR','NFR','ECR','ECOR','CSTM','NE'
]


//Got the zones of the source and destination stations properly


router.get("/getZones", async (req, res) => {
    const src = req.query.src;
    const dest = req.query.dest;

    const response1 = await axios.get(baseUrl+`stationLive?code=${src}`);
    // console.log(response1.data.data[0]);
   const filterSrcExpressTrains = response1.data.data.filter(train => Number(train.train_no)<20000 && Number(train.train_no)>=10000);

   let srcTrueZone, destTrueZone;

   for(const train of filterSrcExpressTrains){
    const srcTrainRoute = (await axios.get(baseUrl+`getRoute?trainNo=${train.train_no}`)).data.data;
    const srcZone = srcTrainRoute.filter(station => {
     if(station.source_stn_code === src) return station;
    })[0].zone;
    console.log(srcZone);
    if(zones.includes(srcZone)){
        srcTrueZone = srcZone;
        break;
    }
   }

   const response2 = await axios.get(baseUrl+`stationLive?code=${dest}`);
   const filterDestExpressTrains = response2.data.data.filter(train => Number(train.train_no)<20000 && Number(train.train_no)>=10000);

   for(const train of filterDestExpressTrains){
    const destTrainRoute = (await axios.get(baseUrl+`getRoute?trainNo=${train.train_no}`)).data.data;
    const destZone = destTrainRoute.filter(station => {
     if(station.source_stn_code === dest) return station;
    })[0].zone;
    console.log(destZone)
    if(zones.includes(destZone)){
        destTrueZone = destZone;
        break;
    }
   }

  if(srcTrueZone==='CSTM') srcTrueZone='CR';
  else if(destTrueZone==='CSTM') destTrueZone='CR';
  if(zones.includes(srcTrueZone+'R')) srcTrueZone=srcTrueZone+'R'
  if(zones.includes(destTrueZone+'R')) destTrueZone=destTrueZone+'R'

   res.status(200).send({data:{srcTrueZone,destTrueZone}})
});

export default router;