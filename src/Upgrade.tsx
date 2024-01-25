import React, { useState, ChangeEvent } from 'react';
import { Form, Input, Grid } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';

interface MainProps {}

export default function Main(props: MainProps) {
  const [status, setStatus] = useState<string>('');
  const [proposal, setProposal] = useState<string>('');

  const bufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleFileChosen = (file: File) => {
    const fileReader = new FileReader();
    fileReader.onloadend = (e: ProgressEvent<FileReader>) => {
      if (e.target && e.target.result instanceof ArrayBuffer) {
        const content = bufferToHex(e.target.result);
        setProposal(`0x${content}`);
      }
    };

    fileReader.readAsArrayBuffer(file);
  };

  return (
    <Grid.Column width={8}>
      <h1>Upgrade Runtime</h1>
      <Form>
        <Form.Field>
          <Input
            type="file"
            id="file"
            label="Wasm File"
            accept=".wasm"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChosen(e.target.files[0])}
          />
        </Form.Field>

        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Upgrade"
            type="UNCHECKED-SUDO-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'system',
              callable: 'setCode',
              inputParams: [proposal],
              paramFields: [true],
            }}
          />
        </Form.Field>

        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
