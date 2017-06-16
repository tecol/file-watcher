import { Component, Inject, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { DirectoryService } from './directory.service';

@Component({
    moduleId: module.id,
    selector: 'folder-input',
    templateUrl: 'folder-input.component.html',
    styleUrls: ['folder-input.component.css'],
})
export class FolderInputComponent {
    @Input() private label: string;
    @Input() private directory: string;
    @Output() private directoryChange: EventEmitter<string> = new EventEmitter<string>();
    private errors: string[] = [];
    @Output() private validateDirectory: EventEmitter<FolderInputComponent> = new EventEmitter<FolderInputComponent>();

    constructor( @Inject(NgZone) private ngZone: NgZone, @Inject(DirectoryService) private directoryService: DirectoryService) { }

    public get currentDirectory(): string {
        return this.directory;
    }

    addError(error: string): void {
        this.errors.push(error);
    }

    clearErrors(): void {
        this.errors = [];
    }

    updateDirectory(directory: string): void {
        this.directory = directory;
        this.directoryChange.emit(directory);
        this.validate();
    }

    validate(): void {
        this.clearErrors();
        this.directoryService.validatePathExistsAndIsDirectory(this.directory,
            (err?: string): void => {
                if (err != null) {
                    this.errors.push(err);
                }
            });

        this.validateDirectory.emit(this);
    }

    selectDirectory(): void {
        this.directoryService.prompt(this.directory)
            .subscribe(
            (path: string) => {
                this.ngZone.run(() => {
                    this.updateDirectory(path);
                });
            },
            (error?: any) => {
                this.ngZone.run(() => {
                    this.errors.push(error);
                });
            });
    }
}