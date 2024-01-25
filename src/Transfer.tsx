import React, { useState, ChangeEvent } from 'react';
import { Form, Input, Grid, Label, Icon, Dropdown, DropdownItemProps } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { useSubstrateState } from './substrate-lib';

interface MainProps {}

interface FormState {
  addressTo: string;
  amount: number;
}

export default function Main(props: MainProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({ addressTo: '', amount: 0 });

  const onChange = (_: React.SyntheticEvent<HTMLElement>, data: DropdownItemProps) => {
    setFormState(prev => ({ ...prev, [data.state]: data.value }));
  };

  const { addressTo, amount } = formState;
  const { keyring } = useSubstrateState();
  const accounts = keyring.getPairs();

  const availableAccounts: DropdownItemProps[] = accounts.map(account => ({
    key: account.meta.name,
    text: account.meta.name,
    value: account.address,
  }));

  return (
    <Grid.Column width={8}>
      <h1>Transfer</h1>
      <Form>
        <Form.Field>
          <Label basic color="teal">
            <Icon name="hand point right" />1 Unit = 1000000000000&nbsp;
          </Label>
          <Label basic color="teal" style={{ marginLeft: 0, marginTop: '.5em' }}>
            <Icon name="hand point right" />
            Transfer more than the existential amount for an account with 0 balance
          </Label>
        </Form.Field>

        <Form.Field>
          <Dropdown
            placeholder="Select from available addresses"
            fluid
            selection
            search
            options={availableAccounts}
            state="addressTo"
            onChange={onChange}
          />
        </Form.Field>

        <Form.Field>
          <Input
            fluid
            label="To"
            type="text"
            placeholder="address"
            value={addressTo}
            state="addressTo"
            onChange={(_, { value }) => setFormState(prev => ({ ...prev, addressTo: value as string }))}
          />
        </Form.Field>

        <Form.Field>
          <Input
            fluid
            label="Amount"
            type="number"
            state="amount"
            onChange={(_, { value }) => setFormState(prev => ({ ...prev, amount: Number(value) }))}
          />
        </Form.Field>

        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Submit"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'balances',
              callable: 'transfer',
              inputParams: [addressTo, amount],
              paramFields: [true, true],
            }}
          />
        </Form.Field>

        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
