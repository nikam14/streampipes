/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { AfterViewInit, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogRef } from '../../../core-ui/dialog/base-dialog/dialog-ref';
import {
  Group,
  Role,
  ServiceAccount,
  UserAccount
} from '../../../core-model/gen/streampipes-model-client';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { UserRole } from '../../../_enums/user-role.enum';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UserService } from '../../../platform-services/apis/user.service';
import { UserGroupService } from '../../../platform-services/apis/user-group.service';

@Component({
  selector: 'sp-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditUserDialogComponent implements OnInit {

  @Input()
  user: any;

  @Input()
  editMode: boolean;

  isUserAccount: boolean;
  parentForm: FormGroup;
  clonedUser: UserAccount | ServiceAccount;

  availableRoles: string[];
  availableGroups: Group[] = [];

  constructor(private dialogRef: DialogRef<EditUserDialogComponent>,
              private fb: FormBuilder,
              private userService: UserService,
              private userGroupService: UserGroupService) {
  }

  ngOnInit(): void {
    this.availableRoles = Object.values(UserRole).filter(value => typeof value === 'string') as string[];
    this.userGroupService.getAllUserGroups().subscribe(response => {
      this.availableGroups = response;
    });
    this.clonedUser = this.user instanceof UserAccount ? UserAccount.fromData(this.user, new UserAccount()) : ServiceAccount.fromData(this.user, new ServiceAccount());
    this.isUserAccount = this.user instanceof UserAccount;
    this.parentForm = this.fb.group({});
    this.parentForm.addControl('username', new FormControl(this.clonedUser.username, Validators.required));
    this.parentForm.addControl('accountEnabled', new FormControl(this.clonedUser.accountEnabled));
    this.parentForm.addControl('accountLocked', new FormControl(this.clonedUser.accountLocked));
    if (this.clonedUser instanceof UserAccount) {
      this.parentForm.addControl('email', new FormControl(this.clonedUser.email));
      this.parentForm.addControl('fullName', new FormControl(this.clonedUser.fullName));
    } else {
      this.parentForm.addControl('clientSecret', new FormControl(this.clonedUser.clientSecret));
    }

    if (!this.editMode && this.isUserAccount) {
      this.parentForm.addControl('password', new FormControl(this.clonedUser.password, Validators.required));
      this.parentForm.addControl('repeatPassword', new FormControl());
      this.parentForm.setValidators(this.checkPasswords);
    }

    this.parentForm.valueChanges.subscribe(v => {
      this.clonedUser.username = v.username;
      this.clonedUser.accountLocked = v.accountLocked;
      this.clonedUser.accountEnabled = v.accountEnabled;
      if (this.clonedUser instanceof UserAccount) {
        this.clonedUser.email = v.email;
        this.clonedUser.fullName = v.fullName;
      } else {
        this.clonedUser.clientSecret = v.clientSecret;
      }
      if (!this.editMode) {
        this.clonedUser.password = v.password;
      }
    });

  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    const pass = group.get('password');
    const confirmPass = group.get('repeatPassword');

    if (!pass || !confirmPass) {
      return null;
    }
    return pass.value === confirmPass.value ? null : { notMatching: true };
  }

  save() {
    if (this.editMode) {
      if (this.isUserAccount) {
        this.userService.updateUser(this.clonedUser as UserAccount).subscribe(() => {
          this.close(true);
        });
      } else {
        this.userService.updateService(this.clonedUser as ServiceAccount).subscribe(() => {
          this.close(true);
        });
      }
    } else {
      if (this.isUserAccount) {
        this.userService.createUser(this.clonedUser as UserAccount).subscribe(() => {
          this.close(true);
        });
      } else {
        this.userService.createServiceAccount(this.clonedUser as ServiceAccount).subscribe(() => {
          this.close(true);
        });
      }
    }
  }

  close(refresh: boolean) {
    this.dialogRef.close(refresh);
  }

  changeGroupAssignment(event: MatCheckboxChange) {
    if (this.clonedUser.groups.indexOf(event.source.value) > -1) {
      this.clonedUser.groups.splice(this.clonedUser.groups.indexOf(event.source.value), 1);
    } else {
      this.clonedUser.groups.push(event.source.value);
    }
  }

  changeRoleAssignment(event: MatCheckboxChange) {
    if (this.clonedUser.roles.indexOf(event.source.value as Role) > -1) {
      this.removeRole(event.source.value);
    } else {
      this.addRole(event.source.value);
    }
  }

  removeRole(role: string) {
    this.clonedUser.roles.splice(this.clonedUser.roles.indexOf(role as Role), 1);
  }

  addRole(role: string) {
    this.clonedUser.roles.push(role as Role);
  }

}
