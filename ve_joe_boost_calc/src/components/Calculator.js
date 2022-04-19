import React, {useState, useEffect} from 'react'
import { ethers } from 'ethers'
import { joePerSec, joePools} from '../utils/joeFarms'
import { boostedURL, exchangeURL, veJoeURL } from '../utils/graphQueries/graphURLs'
import { exchangeQuery, pairsQuery, veJoeQuery } from '../utils/graphQueries/graphQueries'
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { BigNumber } from 'ethers'


export default function Calculator() {
    const [userAddress, setUserAddrress] = useState("") //done
    const [loading, setLoading] = useState(true)
    const [joePer, setJoePer] = useState(0) //done
    const [totalAllocPoint, setTotalAllocPoint] = useState()
    // TheGraph exchangeClient pool info
    const [pairs, setPairs] = useState([])
    //two states below are used to extract necessary fields not present in exchangeClient
    const [graphBoostedMasterChefInfo, setgraphBoostedMasterChefInfo] = useState([])
    const [ethersJsPoolInfo, setethersJsPoolInfo] = useState([])
    
    // joPools contains exchangeClient fields plus allocPoint and totalFactor
    const [joPools, setJoPools] = useState([]) //done
    const [selectedJoPool, setSelectedJoPool] = useState()
    
    
    
    // 
    const [veJoeData, setVeJoeData] = useState()
    const [veJoeSupply, setVEJoeSupply] = useState()
    const [userVeJoe, setUserVeJoe] = useState()
    //
    const [joeStake, setJoeStake] = useState(0)
    const [tokenValue0, setToken0Value] = useState(0)
    const [tokenValue1, setToken1Value] = useState(0)
    const [actualLiqTokens ,setActualLiqTokens] = useState()

    

    const boostedClient = new ApolloClient({
        uri: boostedURL,
        cache: new InMemoryCache(),
      });
      const exchangeClient = new ApolloClient({
        uri: exchangeURL,
        cache: new InMemoryCache(),
      });
      const veJoeClient = new ApolloClient({
        uri: veJoeURL,
        cache: new InMemoryCache(),
      });

      useEffect(() => {
        //
        joePerSec()
          .then(res => setJoePer(res))
          .catch(err => console.log('Unable to fetch joePerSecc: ', err))
        //
        try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        provider.send("eth_requestAccounts", []).then((res) => {
            setUserAddrress(res[0]);
        });
        } catch (err) {
        alert(
            "Web3 provider not found. Please manually fill in your account address."
        );
        }
        //
        boostedClient
            .query({
                query: gql(exchangeQuery),
            })
            .then((boostedData) => {
                console.log('total',boostedData.data.masterChefs)
                setTotalAllocPoint(boostedData.data.masterChefs[0].totalAllocPoint);
                const sorted = [...boostedData.data.pools].sort((a, b)=> a.pair-b.pair)
                setgraphBoostedMasterChefInfo(sorted);
                const poolAddresses = sorted.map((i) => i.pair);
            
        exchangeClient
          .query({
            query: gql(pairsQuery),
            variables: {
              ids: poolAddresses,
              user_id: userAddress,
            },
          })
          .then((data) => {
            setPairs(data.data.pairs);
            setLoading(false);
          })
          .catch((err) => {
            console.log("Error fetching data: ", err);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
        setLoading(false);
      });

      //
      joePools()
      .then(res => {
          const ids = res.map(i => {
              return i
          })
          ids.sort((a, b) => a[0] - b[0])
          setethersJsPoolInfo(ids)
        })
          .catch(err => console.log("Unable to retrieve pairIdsa: ", err))
          
      
        const prodPairs = pairs.map((entry, i) => {
            let copy = {...entry}
            // pair pool data from Graph exchangeClient does not have totalFactor or AllocPoint, add those below
            copy.totalFactor = ethersJsPoolInfo[i].totalFactor.toString()
            copy.allocPoint = graphBoostedMasterChefInfo[i].allocPoint
            console.log('232332  ',copy.allocPoint, totalAllocPoint, parseInt(joePer.toString()))
            copy.joePerSecond = parseInt(copy.allocPoint) / totalAllocPoint * parseInt(joePer.toString())
            return copy
        })
        setJoPools(prodPairs)
        setSelectedJoPool(joPools[8])
      }, [])

      //asdf
    useEffect(() => {
        if(userAddress === undefined || userAddress === '') {
            return
          }
          veJoeClient
            .query({
              query: gql(veJoeQuery),
              variables: {
                id: userAddress,
              },
            })
            .then((data) => {
                setVeJoeData(data.data.veJoes[0]);
                setVEJoeSupply(data.data.veJoes[0].totalVeJoeMinted);
                setUserVeJoe(data.data.user);
            })
            .catch((err) => {
              console.log("Error fetching data: ", err);
            });

            let poolIds = graphBoostedMasterChefInfo.map((d) => d.pair);
            
            exchangeClient
              .query({
                query: gql(pairsQuery),
                variables: {
                  ids: poolIds,
                  user_id: userAddress,
                },
              })
              .then((data) => {
                  data.data.user.liquidityPositions.length > 0 ?
                    setActualLiqTokens(
                      data.data.user.liquidityPositions[0].liquidityTokenBalance
                    ) :
                    setActualLiqTokens(0);
              });
              console.log('vejoe supply', veJoeSupply)
    }, [userAddress])
      

    useEffect(() => {

    })


      return (
          <div>
              { joPools ?
                  console.log('jojojo', veJoeSupply) : null
                  }
          </div>
      )
}