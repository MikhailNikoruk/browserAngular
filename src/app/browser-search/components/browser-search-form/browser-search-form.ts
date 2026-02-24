import { Component, EventEmitter, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';

interface SearchFormControls {
    query: FormControl<string>;
}

@Component({
    selector: 'app-browser-search-form',
    imports: [ReactiveFormsModule],
    templateUrl: './browser-search-form.html',
    styleUrl: './browser-search-form.scss',
})
export class BrowserSearchForm {
    @Output() submitEvent = new EventEmitter<string>();
    @Output() resetEvent = new EventEmitter<void>();

    protected searchForm = new FormGroup<SearchFormControls>({
        query: new FormControl('', { nonNullable: true }),
    });

    protected get queryControl(): FormControl<string> {
        return this.searchForm.controls.query;
    }

    protected get queryValue(): string {
        return this.queryControl.value;
    }

    constructor() {
        this.watchFormValidation();
    }

    protected submitForm(): void {
        const rawQuery: string = this.queryValue;
        const validatedQuery: string = rawQuery.trim();

        if (validatedQuery !== rawQuery) {
            this.queryControl.setValue(validatedQuery);
        }

        this.submitEvent.emit(validatedQuery);
    }

    protected resetForm(): void {
        this.searchForm.reset();
        this.resetEvent.emit();
    }

    private watchFormValidation() {
        this.queryControl.valueChanges
            .pipe(
                debounceTime(1000),
                filter(((newQuery: string) => newQuery.length > 0)),
                map((newQuery: string) => {
                    const trimmedQuery = newQuery.trim();
                    return trimmedQuery;
                }),
                distinctUntilChanged(),
                takeUntilDestroyed()
            )
            .subscribe((validatedQuery: string) => {
                console.log('validatedQuery =>', validatedQuery);
                this.queryControl.setValue(validatedQuery, {emitEvent: false});
            });
    }
}
