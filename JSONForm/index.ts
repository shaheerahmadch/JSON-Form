import { IInputs, IOutputs } from "./generated/ManifestTypes";
import './style/JSONForm.css'

export class JSONForm implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _container: HTMLDivElement;
    private _state: ComponentFramework.Dictionary;
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    private _jsonInput: string = '';
    private _selectedProperties: string | '';
    private _backgroundColor: string | '';
    private _inputFill: string | '';
    private _headingsColor: string | '';
    private _valuesColor: string | '';
    private _headingsFontSize: number | null;
    private _margins: number | null;
    private _valuesFontSize: number | null;
    private _enableShadows: boolean;
    private _enableCopy: boolean;
    private _isReset: boolean;
    private _currentEvent: string | '';
    private _currentKey: string | '';
    private _currentValue: string | '';

    constructor() { }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._currentEvent = 'FormLoaded';
        this._container = container;
        context.mode.trackContainerResize(true);
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._state = state;
        if (this._isReset != context.parameters.Reset.raw) {
            this._currentEvent = 'FormReset'
            this._isReset = context.parameters.Reset.raw;
        }
        this._currentValue = '';
        this._currentKey = '';
        // Set up initial data
        this._jsonInput = context.parameters.JSONInput.raw || '';
        this._enableShadows = context.parameters.Shadows.raw == "1";
        this._enableCopy = context.parameters.AllowCopy.raw == "1";
        this._selectedProperties = context.parameters.SelectedProperties.raw || '';
        this._headingsFontSize = context.parameters.HeadingsFontSize.raw ? context.parameters.HeadingsFontSize.raw : 15;
        this._margins = context.parameters.Margins.raw ? context.parameters.Margins.raw : 30;
        this._valuesFontSize = context.parameters.ValuesFontSize.raw ? context.parameters.ValuesFontSize.raw : 15;
        this._backgroundColor = context.parameters.FormFill.raw ? context.parameters.FormFill.raw : 'white';
        this._inputFill = context.parameters.InputFill.raw ? context.parameters.InputFill.raw : 'white';
        this._headingsColor = context.parameters.HeadingsColor.raw ? context.parameters.HeadingsColor.raw : '#5b5b5b';
        this._valuesColor = context.parameters.ValuesColor.raw ? context.parameters.ValuesColor.raw : 'black';

        // Render the control
        this.renderControl();
        this._notifyOutputChanged()
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        
        if (this._isReset != context.parameters.Reset.raw) {
            this.init(this._context, this._notifyOutputChanged, this._state, this._container)
            //this._isReset = context.parameters.Reset.raw;
        }
        this._enableCopy = context.parameters.AllowCopy.raw == "1";
        this._enableShadows = context.parameters.Shadows.raw == "1";
        this._selectedProperties = context.parameters.SelectedProperties.raw || '';
        this._backgroundColor = context.parameters.FormFill.raw ? context.parameters.FormFill.raw : 'white';
        this._inputFill = context.parameters.InputFill.raw ? context.parameters.InputFill.raw : 'white';
        this._headingsColor = context.parameters.HeadingsColor.raw ? context.parameters.HeadingsColor.raw : '#5b5b5b';
        this._valuesColor = context.parameters.ValuesColor.raw ? context.parameters.ValuesColor.raw : 'black';
        this._headingsFontSize = context.parameters.HeadingsFontSize.raw ? context.parameters.HeadingsFontSize.raw : 15;
        this._valuesFontSize = context.parameters.ValuesFontSize.raw ? context.parameters.ValuesFontSize.raw : 15;
        this._margins = context.parameters.Margins.raw ? context.parameters.Margins.raw : 30;
        this._container.style.overflowY = "scroll";
        this._container.style.overflowX = "hidden";
        this._container.style.backgroundColor = this._backgroundColor;
        this._container.style.height = `${context.mode.allocatedHeight - 0}px`;
        this._container.style.width = `${context.mode.allocatedWidth - 0}px`;
        // Update data
        //this._jsonInput = context.parameters.JSONInput.raw || '';

        // Re-render the control
        this.renderControl();
    }

    public getOutputs(): IOutputs {
        // Return the updated JSON output
        return {
            JSONOutput: this._jsonInput,
            CurrentEvent: this._currentEvent,
            CurrentKey: this._currentKey,
            CurrentValue: this._currentValue
        };
    }

    public destroy(): void {
        // Cleanup
    }

    private renderControl(): void {
        // Clear previous content
        this._container.innerHTML = '';

        if (!this._jsonInput) {
            // If JSON input is empty, show a message
            const message = document.createElement('div');
            message.innerText = 'No JSON data provided.';
            this._container.appendChild(message);
            return;
        }

        try {
            const jsonData = JSON.parse(this._jsonInput);
            const form = document.createElement('form');
            form.className = "JSONViewForm";
            form.style.margin = this._margins + 'px';

            if (this._enableCopy) {
                const copyIcon = document.createElement('div');
                copyIcon.innerHTML = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 115.77 122.88" style="enable-background:new 0 0 115.77 122.88" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style><g><path class="st0" fill="' + this._headingsColor + '" d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z"/></g></svg>';
                // Replace 'path_to_your_svg_file.svg' with the actual path to your SVG file

                copyIcon.onclick = () => {
                    this._currentEvent = 'JsonCopied'
                    this.copyJSONToClipboard();
                };
                copyIcon.style.width = '24px'; // Adjust width and height as needed
                copyIcon.style.height = '24px';
                copyIcon.style.marginLeft = '96%';
                copyIcon.style.marginBottom = '25px';

                copyIcon.style.cursor = "pointer";
                form.appendChild(copyIcon);
            }
            let propertiesToDisplay: string[];

            // Check if SelectedProperties parameter is provided and not empty
            if (this._selectedProperties && this._selectedProperties.trim() !== '' && this._selectedProperties.trim() !== 'val') {
                // Split the comma-separated string into an array of property names
                const selectedProps = this._selectedProperties.split(',').map(prop => prop.trim());

                // Filter the properties of jsonData based on the selected properties
                propertiesToDisplay = Object.keys(jsonData).filter(key => selectedProps.includes(key));
            } else {
                // If SelectedProperties parameter is blank, display all properties from the input JSON
                propertiesToDisplay = Object.keys(jsonData);
            }

            // Create form elements dynamically based on the selected properties
            propertiesToDisplay.forEach(key => {
                const value = jsonData[key];

                const label = document.createElement('label');
                label.style.fontSize = this._headingsFontSize + 'px';
                label.innerText = this.toTitleCase(key);
                label.className = "JSONViewLabel";
                label.style.color = this._headingsColor;

                const input = document.createElement('input');
                input.style.boxShadow = this._enableShadows ? 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' : '';
                input.className = "JSONViewInput";
                input.style.backgroundColor = this._inputFill;
                input.style.fontSize = this._valuesFontSize + 'px';
                input.style.color = this._valuesColor;
                input.id = key;
                let datatype = typeof value === 'boolean' ? 'checkbox' : typeof value === 'number' ? 'number' : 'text';
                datatype = datatype === 'text' && this.isDateString(String(value)) ? 'date' : datatype;
                input.type = datatype;
                let inputValue = datatype === 'date' ? `${new Date(value).getFullYear()}-${(new Date(value).getMonth() + 1).toString().padStart(2, '0')}-${new Date(value).getDate().toString().padStart(2, '0')}` : String(value);
                input.value = String(inputValue);

                // Add event listener to input elements to update JSON data
                input.addEventListener('change', () => {
                    this._currentEvent = 'ValueChanged';
                    this._currentKey = key;
                    this._currentValue = String(input.value);
                    this.updateJsonData(key, typeof value === 'boolean' ? input.checked : input.value, datatype);
                });

                form.appendChild(label);
                form.appendChild(input);
                form.appendChild(document.createElement('br'));
            });

            this._container.appendChild(form);
        } catch (error) {
            // If JSON parsing fails, show an error message
            const errorMessage = document.createElement('div');
            errorMessage.innerText = 'Invalid JSON format.';
            this._container.appendChild(errorMessage);
            console.log(error)
        }
    }

    private isDateString(sDate: string) {
        const newDate = new Date(sDate);
        return !isNaN(newDate.getTime());
    }
    private copyJSONToClipboard(){
        navigator.clipboard.writeText(this._jsonInput)
        this._notifyOutputChanged();
    }

    private toTitleCase(str: string) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
    private updateJsonData(key: string, value: string | boolean | number, dataype: string): void {
        try {
            console.log('changed')
            console.log(dataype)
            if (dataype === 'number' && parseFloat(value as string)) {
                value = parseFloat(value as string);
            }
            const jsonData = JSON.parse(this._jsonInput);
            let updatedValue: any = value; // Initialize the updated value    
            jsonData[key] = updatedValue; // Update the value in the JSON object
            const updatedJsonInput = JSON.stringify(jsonData);

            // Notify the framework that output has changed only if the JSON input has actually changed
            if (updatedJsonInput !== this._jsonInput) {
                this._jsonInput = updatedJsonInput;
                this._notifyOutputChanged();
            }
        } catch (error) {
            console.error('Error updating JSON data:', error);
        }
    }


}
