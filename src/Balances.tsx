import React, { useEffect, useState } from 'react';
import { Table, Grid, Button, Label } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSubstrateState } from './substrate-lib';

interface Account {
  address: string;
  meta: {
    name: string;
  };
}

export default function Main(props: any) {
  const { api, keyring } = useSubstrateState();
  const accounts: Account[] = keyring.getPairs();
  const [balances, setBalances] = useState<{ [address: string]: string }>({});

  useEffect(() => {
    const addresses: string[] = keyring.getPairs().map((account: { address: any; }) => account.address);
    let unsubscribeAll: (() => void) | null = null;

    api.query.system.account
      .multi(addresses, (accountBalances: { data: { free: { toHuman: () => any; }; }; }[]) => {
        const balancesMap: { [address: string]: string } = addresses.reduce(
          (acc, address, index) => ({
            ...acc,
            [address]: accountBalances[index].data.free.toHuman(),
          }),
          {}
        );
        setBalances(balancesMap);
      })
      .then((unsub: (() => void) | null) => {
        unsubscribeAll = unsub;
      })
      .catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [api, keyring, setBalances]);

  return (
    <Grid.Column>
      <h1>Balances</h1>
      {accounts.length === 0 ? (
        <Label basic color="yellow">
          No accounts to be shown
        </Label>
      ) : (
        <Table celled striped size="small">
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3} textAlign="right">
                <strong>Name</strong>
              </Table.Cell>
              <Table.Cell width={10}>
                <strong>Address</strong>
              </Table.Cell>
              <Table.Cell width={3}>
                <strong>Balance</strong>
              </Table.Cell>
            </Table.Row>
            {accounts.map(account => (
              <Table.Row key={account.address}>
                <Table.Cell width={3} textAlign="right">
                  {account.meta.name}
                </Table.Cell>
                <Table.Cell width={10}>
                  <span style={{ display: 'inline-block', minWidth: '31em' }}>
                    {account.address}
                  </span>
                  <CopyToClipboard text={account.address}>
                    <Button
                      basic
                      circular
                      compact
                      size="mini"
                      color="blue"
                      icon="copy outline"
                    />
                  </CopyToClipboard>
                </Table.Cell>
                <Table.Cell width={3}>
                  {balances &&
                    balances[account.address] &&
                    balances[account.address]}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Grid.Column>
  );
}
