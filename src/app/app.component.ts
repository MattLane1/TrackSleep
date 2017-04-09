import { Component, ChangeDetectorRef } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Events } from 'ionic-angular';
import { TabsPage } from '../pages/tabs/tabs';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = TabsPage;
  items: FirebaseListObservable<any[]>;

  afp: AngularFire;

  sleepTimesArray: Array<any> = [0];
  sleepDatesArray: Array<any> = [0];


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private ref: ChangeDetectorRef, af: AngularFire, public events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      console.log("Ping");
     
     this.items = af.database.list('/SleepInfo', { preserveSnapshot: true });
     this.items
         .subscribe(snapshots => {
             snapshots.forEach(snapshot => {
                 console.log(snapshot.val())
                 console.log(snapshot.key)
                 //this.sleepTimesArray[snapshot.key] = snapshot.val();
                 this.sleepTimesArray[0] = snapshot.val();
                 console.log("Ping");
             });
             console.log("TimesArray-Pass", this.sleepTimesArray[0]);
             this.events.publish('Array:times', (this.sleepTimesArray[0]));
             console.log("Ping");
         })
     console.log("Ping");
     this.afp = af;

     this.items = af.database.list('/DateInfo', { preserveSnapshot: true });
     this.items
         .subscribe(snapshots => {
             snapshots.forEach(snapshot => {
                 console.log(snapshot.val())
                 console.log(snapshot.key)
                 this.sleepDatesArray[0] = snapshot.val();
                 console.log("Ping");
             });
             console.log("DatesArray-Pass", this.sleepDatesArray[0]);
             this.events.publish('Array:dates', (this.sleepDatesArray[0]));
             console.log("Ping========================================================");
         });

     this.events.subscribe('SleepWake:wake', userEventData => {
         console.log("Ping------------------------------------------------------------");
          this.SaveData(userEventData);
      });
    });
    console.log("Ping");
    console.log("End Constructor");
  }

  SaveData(sleepArray: Array<any>) {
      console.log("SaveDataFunction");

      console.log('SleepArray', sleepArray);
      console.log('SleepArray-0', sleepArray[0]);
   
      console.log('SleepArray-1', sleepArray[1]);
      //console.log('SleepArray', sleepArray[1].data);
      console.log("Ping");
      const itemObservable = this.afp.database.object('/DateInfo');
      const itemObservable2 = this.afp.database.object('/SleepInfo');

      itemObservable2.set({ SleepTrack: sleepArray[0] });
      itemObservable.set({ DateTrack: sleepArray[1] });

      console.log("Spitout-")
      this.items = this.afp.database.list('/DateInfo');
      console.log(this.items);
      console.log("End- Spitout-")
  }

}
