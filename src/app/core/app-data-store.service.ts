import { inject, Injectable } from "@angular/core";
import { LocalStorageRepositoryService } from "./local-storage-repository.service";
import { BehaviorSubject, Observable } from "rxjs";

interface AppState {
    theme?: 'light' | 'dark'
    isSomething1: boolean;
    isSomething2: boolean;
    isSomething3: boolean;
}

const DEFAULT_STATE: AppState = {
    theme: 'light',
    isSomething1: false,
    isSomething2: false,
    isSomething3: false,
};

@Injectable({
    providedIn: 'root'
})
export class AppDataStoreService {
    private readonly stateKey = 'app-data-key';
    private readonly storage = inject(LocalStorageRepositoryService);

    private state: BehaviorSubject<AppState> = new BehaviorSubject<AppState>(DEFAULT_STATE);
    public state$: Observable<AppState> = this.state.asObservable();

    constructor() {
        this.parseStateData();
    }

    public updateStateData(stateUpdates: Partial<AppState>) {
        const currentState: AppState = this.state.getValue();
        const newState: AppState = {
            ...currentState,
            ...stateUpdates
        };
        this.state.next(newState);
        this.storage.setData(this.stateKey, newState);
    }

    private parseStateData(): void {
        const stateFromStorage = this.storage.getData<AppState>(this.stateKey);
        const isValidState = this.validateSourceState(stateFromStorage);

        if (!isValidState) {
            this.state.next(DEFAULT_STATE);
            this.storage.setData(this.stateKey, DEFAULT_STATE);
            return;
        }

        this.state.next(stateFromStorage as AppState);
    }

    private validateSourceState(sourceState: any): boolean {
        if (!sourceState) { return false; }
        if (typeof sourceState !== 'object') { return false; }
        if (!Object.keys(sourceState).length) { return false; }
        return true;
    }
}
