import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'new-policy-statistics-dialog',
    templateUrl: './new-policy-statistics-dialog.component.html',
    styleUrls: ['./new-policy-statistics-dialog.component.scss'],
})
export class NewPolicyStatisticsDialog {
    public loading = true;
    public policy: any;
    public policies: any[];
    public dataForm = new FormGroup({
        name: new FormControl('', Validators.required),
        description: new FormControl(''),
        policy: new FormControl(null, Validators.required)
    });

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private dialogService: DialogService,
    ) {
        this.policies = this.config.data?.policies || [];
        this.policies = this.policies.filter((p) => p.instanceTopicId);
        this.policy = this.config.data?.policy || null;
        this.dataForm.setValue({
            name: '',
            description: '',
            policy: this.policy
        })
    }

    public get currentPolicy(): any {
        return this.dataForm.value.policy;
    }

    ngOnInit() {
        this.loading = false;
    }

    ngOnDestroy(): void {
    }

    public onClose(): void {
        this.ref.close(null);
    }

    public onSubmit(): void {
        if (this.dataForm.valid) {
            this.ref.close(this.dataForm.value);
        }
    }
}
