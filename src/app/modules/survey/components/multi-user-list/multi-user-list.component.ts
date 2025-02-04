import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from 'src/app/modules/login/services/device.service';
import { DeviceConstants } from 'src/app/shared/models/url-constants';
import { ModalComponent, ModalConfig } from 'src/app/modules/shared/components/modal/modal.component';
import { LocalStorageService, StorageItem } from 'src/app/shared/services/local-storage.service';
import { BaseComponent } from 'src/app/shared/util/base.util';

export interface Member {
  deviceId: string;
  homeNo: string;
  memberName: string;
  memberNo: string;
  memberSurveyStatus: string;
  memberSurveyStatusId: number;
  usePercentage: number;
}

@Component({
  selector: 'app-multi-user-list',
  templateUrl: './multi-user-list.component.html',
  styleUrls: ['./multi-user-list.component.css']
})
export class MultiUserListComponent extends BaseComponent implements OnInit {

  deviceId: any;
  deviceState: any;
  multiUserListForm: FormGroup = this.fb.group({});
  multiUserCoViewerForm: FormGroup = this.fb.group({});
  members: FormArray | undefined;
  coViewers: FormArray | undefined;
  controls: AbstractControl[] = [];
  coViewerControls: AbstractControl[] = [];
  showPercentageError: boolean = false;
  showCoviewerPercentageError: boolean = false;
  singleViewerPe: string = "";
  deviceName:any;
  resubmit: boolean = false;
  @ViewChild('modal')
  private modalComponent!: ModalComponent;

  constructor(private fb: FormBuilder, private Activatedroute: ActivatedRoute, private router: Router,
    private deviceService: DeviceService,  private localStorageService:LocalStorageService,) {
      super();
     }
     ngAfterViewInit(){
      super.afterViewInit(this.modalComponent);
    }

  ngOnInit(): void {
    this.deviceName = this.localStorageService.getItem(StorageItem.DEVICENAME);
    this.deviceId = this.Activatedroute.snapshot.params['deviceId'];
    this.deviceState = this.Activatedroute.snapshot.params['state'];
    if(this.deviceState == "Completed") {
      this.resubmit = true;
    }
    this.multiUserListForm = this.fb.group({
      arr: this.fb.array([])
    })
    this.multiUserCoViewerForm = this.fb.group({
      deviceId:  this.deviceId,
      singleViewerPe: new FormControl(''),
      coViewerPerce: new FormControl('')
    })
    this.controls = (this.multiUserListForm.get('arr') as FormArray).controls;

    this.deviceService.getCustomRequest(DeviceConstants.memberDeviceUsageGetUrl + this.deviceId).subscribe(response => {
      if (response) {
        response.forEach((mem: any) => {
          this.addMemberPercentage(mem);
        });
      }
    });

    /* TODO:
    Currently hardcoded 101, where post is not working
    */
    this.deviceService.getCustomRequest(DeviceConstants.deviceCoviewer + this.deviceId).subscribe(response => {
      if (response) {
        this.coViewerForm.coViewerPerce.setValue('' + response['coViewerPerce']);
        this.coViewerForm.singleViewerPe.setValue('' + response['singleViewerPe']);
      }
    });
  }

  get coViewerForm() {
    return this.multiUserCoViewerForm.controls;
  }

  addMemberPercentage(member: Member) {
    this.members = this.multiUserListForm.get('arr') as FormArray;
    this.members.push(this.fb.group({
      usePercentage: member.usePercentage?member.usePercentage: "0",
      memberName: member.memberName,
      deviceId: member.deviceId,
      homeNo: member.homeNo,
      memberNo: member.memberNo
    }))
  }

  updateMemberDevice(index: any) {
    if (this.members) {
      this.deviceService.updateDeviceMemberWithPercentage(this.controls[index].value).subscribe(
        res => {
          console.log("Updated Member device");
        }
      );
    }
  }

  updateCoviewerDevice() {
    if (this.members) {
      this.deviceService.updateCoviewerWithPercentage(this.multiUserCoViewerForm.value).subscribe(
        res => {
          console.log("Updated Coviewer device");
        }
      );
    }
  }

  // addMemberCoviewerPercentage(member: any) {
  //   this.coViewers = this.multiUserCoViewerForm.get('arr') as FormArray;
  //   this.coViewers.push(this.fb.group({
  //     coViewerPerce: member['coViewerPerce'],
  //     deviceId: member.deviceId,
  //     homeNo: member.homeNo,
  //     singleViewerPe: member.singleViewerPe
  //   }))
  //   this.singleViewerPe = member.singleViewerPe;
  // }

  saveAndExit() {
    if (this.isMemberPercentageMoreThanHundered()) {
      this.showPercentageError = true;
    } else {
      this.showPercentageError = false;
    }
    if(this.isCoViewerPercentageMoreThanHundered()){
      this.showCoviewerPercentageError= true;
    }
    else{
      this.showCoviewerPercentageError= false;
    }
  }
  continueNavigate() {
    if (this.isMemberPercentageMoreThanHundered()) {
      this.showPercentageError = true;
    } else {
      this.showPercentageError = false;
    }
    if(this.isCoViewerPercentageMoreThanHundered()){
      this.showCoviewerPercentageError= true;
    }
    else{
      this.showCoviewerPercentageError= false;
    }
    if(!this.showCoviewerPercentageError && !this.showPercentageError){
      this.router.navigateByUrl('survey/deviceUsage/' + this.deviceState + '/' + this.deviceId);
    }
  }

  isMemberPercentageMoreThanHundered() {
    let MemberSumPercentage = 0;
    this.controls.forEach(
      control => {
        MemberSumPercentage = MemberSumPercentage + parseInt(control.value["usePercentage"]);
      })
    return MemberSumPercentage != 100;
  }

  isCoViewerPercentageMoreThanHundered(){
    let coViewerSumPercentage = 0;
    coViewerSumPercentage = parseInt(this.coViewerForm.coViewerPerce.value) + 
    parseInt(this.coViewerForm.singleViewerPe.value);
    return coViewerSumPercentage != 100;
  }

  exitEvent(isBackAction:boolean) {
    const message ="You have successfully submitted " +this.deviceName+ " device information to us";
     this.router.navigate(['survey/Thankyou/'+this.deviceName], {state: {message: message}});
   }

   resubmitForm() {
    const message ="Thank you for updating your info page! ";
  this.router.navigate(['survey/Thankyou/'+this.deviceName], {state: {message: message}});
  }
}
