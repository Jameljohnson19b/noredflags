import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors } from '../../constants/colors';
import { getScoreColor } from '../../lib/scoring/colorMap';
import { SubjectService, SubjectProfile } from '../../lib/subjects/subjectService';
import { UserService } from '../../lib/user/userService';
import { router, Href } from 'expo-router';

function SubjectCard({ subject, tier }: { subject: SubjectProfile, tier: string }) {
  const classification = 'Needs Clarification';
  const isPro = tier === 'pro';

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardTouchable}
        activeOpacity={0.8}
        onPress={() => router.push({
          pathname: '/capture/live-input',
          params: { sessionId: subject.id }
        })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{subject.name}</Text>
          <View style={[styles.dot, { backgroundColor: getScoreColor(classification) }]} />
        </View>
        <Text style={styles.cardDate}>
          Added {new Date(subject.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.proButton, !isPro && styles.proButtonLocked]}
        onPress={() => isPro
          ? router.push({ pathname: '/reports/subject-analysis', params: { id: subject.id } })
          : router.push('/paywall/pro')
        }
      >
        <Text style={[styles.proButtonText, !isPro && styles.proButtonTextLocked]}>
          {isPro ? 'FULL INTELLIGENCE REPORT' : '🔒 UNLOCK FULL ANALYSIS'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ReportsHub() {
  const [subjects, setSubjects] = useState<SubjectProfile[]>([]);
  const [tier, setTier] = useState<string>('none');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const profile = await UserService.getProfile();
      setTier(profile?.tier || 'none');

      const list = await SubjectService.getSubjects();
      setSubjects(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={Colors.text} style={{ marginTop: 100 }} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor="#fff" />
      }
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.header}>Intelligence</Text>
          <Text style={styles.subtitle}>Your analytical breakdown.</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/capture/live-input')}>
          <Text style={styles.addButtonText}>+ ADD</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {subjects.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No personas being tracked.</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/capture/live-input')}>
              <Text style={styles.emptyButtonText}>Start Analyzing</Text>
            </TouchableOpacity>
          </View>
        ) : (
          subjects.map(s => <SubjectCard key={s.id} subject={s} tier={tier} />)
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  header: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 18,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#111',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardTouchable: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  cardDate: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  proButton: {
    backgroundColor: '#111',
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#222',
  },
  proButtonLocked: {
    backgroundColor: '#0a0a0a',
  },
  proButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  proButtonTextLocked: {
    color: '#444',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '500',
  },
  emptyButton: {
    backgroundColor: Colors.text,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: Colors.background,
    fontWeight: '900',
    fontSize: 14,
  }
});

